import { ActivityArgs } from "@/types";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { contactId: string } }
) {
  const activityArgs: ActivityArgs = await request.json();

  const { title, date, description, type } = activityArgs;

  const contact = await prisma.contact.findUnique({
    where: { id: params.contactId },
  });

  if (!contact)
    return new NextResponse(
      JSON.stringify({ success: false, message: "No Contact Found" }),
      { status: 404, headers: { "content-type": "application/json" } }
    );

  if (date && type)
    await prisma.activity.create({
      data: {
        contactId: params.contactId,
        title: title || "",
        date,
        description: description || "",
        type,
      },
    });

  title &&
    (await prisma.goals.updateMany({
      where: {
        userId: contact.userId,
      },
      data: {
        messages: {
          increment: 1,
        },
      },
    }));

  const count = await prisma.activity.count({
    where: {
      Contact: { userId: contact.userId },
      type: "USER",
    },
  });

  return NextResponse.json({ showQuote: count % 10 === 0 });
}
