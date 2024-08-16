import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Activity, Contact } from "@prisma/client";
import { ContactArgs } from "@/types";
import { getActionType } from "@/lib/utils";

export async function GET(
  request: Request,
  { params }: { params: { contactId: string } }
) {
  const contact = await prisma.contact.findUnique({
    where: {
      id: params.contactId,
    },
  });

  if (!contact)
    return new NextResponse(
      JSON.stringify({ success: false, message: "No Contact Found" }),
      { status: 404, headers: { "content-type": "application/json" } }
    );

  const activities = await prisma.activity.findMany({
    where: {
      contactId: contact?.id,
    },
    orderBy: [
      { type: "asc" },
      {
        date: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  const user = await prisma.user.findUnique({ where: { id: contact.userId } });

  const parsedContact = parseContact(contact, activities);

  return NextResponse.json({
    contact: parsedContact,
    hasViewedProfileTutorial: user?.hasViewedProfileTutorial,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { contactId: string } }
) {
  const contact = await prisma.contact.delete({
    where: { id: params.contactId },
  });

  return NextResponse.json(contact);
}

export async function PUT(
  request: Request,
  { params }: { params: { contactId: string } }
) {
  const contactArgs: ContactArgs = await request.json();

  const { isArchived } = contactArgs;

  const updatedContact = await prisma.contact.update({
    where: { id: params.contactId },
    data: {
      isArchived,
    },
  });

  return NextResponse.json(updatedContact);
}

const parseContact = (contact: Contact, activities: Activity[]) => {
  const {
    id,
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
    isArchived,
  } = contact;

  return {
    id,
    type: getActionType(activities[0], goalDays),
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
    history: activities[activities.length - 1].description,
    activities: activities.filter(
      (activity) => activity.contactId === contact.id
    ),
    isArchived,
  };
};
