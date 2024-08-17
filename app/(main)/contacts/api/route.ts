import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Activity, Contact, Prisma } from "@prisma/client";
import { SearchParams } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userEmail = searchParams.get(SearchParams.UserEmail);
  const name = searchParams.get(SearchParams.Name);

  if (!userEmail)
    return new NextResponse(
      JSON.stringify({ success: false, message: "Missing Email" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );

  const user = await prisma.user.findUnique({ where: { email: userEmail } });

  if (!user)
    return new NextResponse(
      JSON.stringify({ success: false, message: "No User Found" }),
      { status: 404, headers: { "content-type": "application/json" } }
    );

  const contacts = await getContacts(name, user.id);

  const contactIds = contacts.map((c) => c.id);

  const lastActivity = await prisma.activity.findFirst({
    where: {
      contactId: { in: contactIds },
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
    distinct: ["contactId"],
  });

  const parsedContacts = parseContacts(contacts, lastActivity);

  return NextResponse.json({
    contacts: parsedContacts,
    hasViewedContactsTutorial: user.hasViewedContactsTutorial,
  });
}

const parseContacts = (contacts: Contact[], lastActivity: Activity | null) => {
  const parsedContacts = contacts.map((contact) => {
    return {
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      title: contact.title,
      interests: contact.interests,
      note: lastActivity?.note || "",
      isArchived: contact.isArchived,
    };
  });

  return parsedContacts;
};

const getContacts = async (name: string | null, userId: string) => {
  let whereClause: Prisma.ContactWhereInput = {
    userId,
  };

  if (name) {
    const [firstName, lastName] = name.split(" ");

    if (lastName) {
      whereClause = {
        ...whereClause,
        firstName: { contains: firstName, mode: "insensitive" },
        lastName: { contains: lastName, mode: "insensitive" },
      };
    } else {
      whereClause = {
        ...whereClause,
        OR: [
          { firstName: { contains: firstName, mode: "insensitive" } },
          { lastName: { contains: firstName, mode: "insensitive" } },
        ],
      };
    }
  }

  const contacts = await prisma.contact.findMany({
    where: whereClause,
    orderBy: [
      {
        firstName: "asc",
      },
      {
        lastName: "asc",
      },
    ],
  });

  return contacts;
};
