import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Activity, Contact, Prisma } from "@prisma/client";
import { SearchParams } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userEmail = searchParams.get(SearchParams.UserEmail);
  const name = searchParams.get(SearchParams.Name);
  const tagsString = searchParams.get(SearchParams.Tags);
  const tags = tagsString ? tagsString.split(",") : [];
  const count = searchParams.get("count");
  const totalTags = searchParams.get("totalTags");

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

  const contacts = await getContacts(name, user.id, tags);

  if (count === "true") return NextResponse.json({ count: contacts.length });

  if (totalTags === "true")
    return NextResponse.json({
      tags: contacts.flatMap((contact) => contact.interests),
    });

  const contactIds = contacts.map((c) => c.id);

  const activities = await prisma.activity.findMany({
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

  const parsedContacts = parseContacts(contacts, activities);

  return NextResponse.json({
    contacts: parsedContacts,
    hasViewedContactsTutorial: user.hasViewedContactsTutorial,
  });
}

const parseContacts = (contacts: Contact[], activities: Activity[]) => {
  const parsedContacts = contacts.map((contact) => {
    return {
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      title: contact.title,
      interests: contact.interests,
      note: activities.filter(
        (activity) => activity.contactId === contact.id
      )[0].note,
      isArchived: contact.isArchived,
    };
  });

  return parsedContacts;
};

const getContacts = async (
  name: string | null,
  userId: string,
  tags: string[]
) => {
  let whereClause: Prisma.ContactWhereInput = {
    userId,
  };

  if (tags.length !== 0)
    whereClause = { ...whereClause, interests: { hasSome: tags } };

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
