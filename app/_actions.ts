"use server";

import prisma from "@/lib/prisma";

import { isCurrentMonth, validateEmail, validatePhone } from "@/lib/utils";
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
  linkedIn: string;
  email: string;
  phone: string;
  links: string;
  interests: string;
  history: string;
  userEmail: string;
  description: string;
  note: string;
  contactId: string;
  isFromMessage: boolean;
  isFromProfile: boolean;
  isFromDashboard: boolean;
  localizedISODate: string;
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
  const linkedIn = formData.get("linkedIn");
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
  const history = formData.get("history");

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
        linkedIn,
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
        note: "",
        description: history || "",
        date: new Date(),
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
        linkedIn,
        email,
        phone,
        links,
        interests,
      },
    });

    if (history) {
      const creationActivity = await prisma.activity.findFirst({
        where: { contactId: id, type: "SYSTEM" },
        select: { id: true },
      });

      creationActivity?.id &&
        (await prisma.activity.updateMany({
          where: { id: creationActivity.id },
          data: { description: history },
        }));
    }

    if (!contact) throw new Error("Contact not found");
  }

  redirect(`/contacts/${contact.id}?${SearchParams.IsChanged}=true`);
}

export async function upsertActivity(formData: FormData) {
  const id = formData.get("id");
  const title = formData.get("title");
  const description = formData.get("description");
  const note = formData.get("note");
  const contactId = formData.get("contactId");
  const isFromMessage = formData.get("isFromMessage");
  const isFromProfile = formData.get("isFromProfile");
  const localizedISODate = formData.get("localizedISODate");
  const isFromDashboard = formData.get("isFromDashboard");

  await prisma.activity.upsert({
    where: { id },
    update: {
      title,
      description,
      note,
      date: new Date(localizedISODate),
    },
    create: {
      contactId,
      title,
      description,
      note,
      date: new Date(localizedISODate),
      type: "USER",
    },
  });

  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
  });

  if (!contact) throw new Error("Contact not found");

  if (isCurrentMonth(localizedISODate)) {
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
  }

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
    const redirectPath = SearchParams.RedirectPath;
    const destinationPath = isFromDashboard
      ? "/dashboard"
      : `/contacts/${contactId}?${SearchParams.IsChanged}=true`;

    const path =
      count % 10 === 0
        ? `/quote?${redirectPath}=${destinationPath}`
        : destinationPath;

    redirect(path);
  }
}
