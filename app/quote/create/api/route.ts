import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (key !== process.env.CRON_KEY) {
    return NextResponse.json(null, { status: 404 });
  }

  const quotes = await prisma.quote.createMany({
    data: [
      {
        text: "It’s not about you at all. It’s what you can do for others. Lead with service.",
        author: "Laura King",
        titles: ["Practice leader", "coach", "speaker", "facilitator"],
      },
      {
        text: "Networking is not just something we do to advance our careers or succeed but is a critical aspect of who we are. Humans, by nature, are communal, and lives are enhanced through building relationships.",
        author: "David Fritzinger",
        titles: ["Associate director", "technology", "consulting"],
      },
      {
        text: "My motto in terms of connecting with others now is: what do I have to lose?! Don’t hesitate on hitting send to an invite or a LinkedIn request. Send the email, make the connection. Don’t overthink it. Put yourself out there! What do you have to lose?",
        author: "Erika Maonde",
        titles: ["Product Manager"],
      },
      {
        text: "I often tell people who are full-time employees or freelancers, both new and experienced, just how important it is to continue connecting in meaningful ways with people in their industry as well as others who can hear their story. One day when a career change is imminent, that network of meaningful connections may help you stay afloat.",
        author: "Constantina Watters",
        titles: ["CEO of Sproute Creative"],
      },
    ],
  });

  return NextResponse.json(quotes);
}
