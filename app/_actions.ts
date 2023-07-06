"use server";

import prisma from "@/lib/prisma";

import { validateEmail, validatePhone } from "@/lib/utils";
import { SearchParams } from "@/types";
import { redirect } from "next/navigation";

interface FormDataOptions {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  industry: string;
  goalDays: number;
  email: string;
  phone: string;
  links: string;
  interests: string;
  userEmail: string;
  date: string;
  description: string;
  contactId: string;
  isFromMessage: boolean;
  isFromProfile: boolean;
}

interface FormData {
  get(name: keyof FormDataOptions): string;
}

export async function upsertContact(formData: FormData) {
  const userEmail = formData.get("userEmail");

  const id = formData.get("id");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const title = formData.get("title");
  const company = formData.get("company");
  const industry = formData.get("industry");
  const goalDays = Number(formData.get("goalDays"));
  const email = formData.get("email");
  const phone = formData.get("phone");
  const links = formData
    .get("links")
    .split(",")
    .filter((link) => link !== "");
  const interests = formData
    .get("interests")
    .split(",")
    .filter((link) => link !== "");

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });
  if (!user) throw new Error("User not found");

  if (email) validateEmail(email);
  if (phone) validatePhone(phone);

  let contact;

  if (!id) {
    contact = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        title,
        company,
        industry,
        goalDays,
        email,
        phone,
        links,
        interests,
        userId: user.id,
      },
    });

    await prisma.activity.create({
      data: {
        contactId: contact.id,
        title: "Contact created",
        description: "",
        type: "SYSTEM",
      },
    });

    await prisma.goals.updateMany({
      where: {
        userId: user.id,
      },
      data: {
        connections: {
          increment: 1,
        },
      },
    });
  } else {
    contact = await prisma.contact.update({
      where: { id },
      data: {
        firstName,
        lastName,
        title,
        company,
        industry,
        goalDays,
        email,
        phone,
        links,
        interests,
      },
    });

    if (!contact) throw new Error("Contact not found");
  }

  redirect(`/contacts/${contact.id}?${SearchParams.IsChanged}=true`);
}

export async function createActivity(formData: FormData) {
  const title = formData.get("title");
  const date = formData.get("date");
  const description = formData.get("description");
  const contactId = formData.get("contactId");
  const isFromMessage = formData.get("isFromMessage");
  const isFromProfile = formData.get("isFromProfile");

  await prisma.activity.create({
    data: {
      contactId,
      title,
      description,
      date,
      type: "USER",
    },
  });

  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
  });

  if (!contact) throw new Error("Contact not found");

  await prisma.goals.updateMany({
    where: {
      userId: contact.userId,
    },
    data: {
      messages: {
        increment: 1,
      },
    },
  });

  const count = await prisma.activity.count({
    where: {
      Contact: { userId: contact.userId },
      type: "USER",
    },
  });

  if (isFromMessage) {
    const redirectPath = SearchParams.RedirectPath;
    const destinationPath = isFromProfile ? "/contacts" : "/dashboard";

    const path =
      count % 10 === 0
        ? `/quote?${redirectPath}=${destinationPath}`
        : destinationPath;

    redirect(path);
  } else {
    if (count % 10 === 0)
      return redirect(
        `/quote?${SearchParams.RedirectPath}=/contacts/${contactId}?${SearchParams.IsChanged}=true`
      );

    redirect(`/contacts/${contactId}?${SearchParams.IsChanged}=true`);
  }
}
