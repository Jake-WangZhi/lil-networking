import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (key !== process.env.CRON_KEY) {
    return NextResponse.json(null, { status: 404 });
  }

  try {
    const goalsCollection = await prisma.goals.findMany();

    await prisma.$transaction(
      goalsCollection.map((goals) => {
        const {
          connections,
          goalConnections,
          messages,
          goalMessages,
          streak,
          highestStreak,
        } = goals;

        const isGoalReached =
          connections >= goalConnections && messages >= goalMessages;

        return prisma.goals.update({
          where: {
            id: goals.id,
          },
          data: {
            streak: {
              increment: isGoalReached ? 1 : -streak,
            },
            highestStreak: {
              increment: streak === highestStreak && isGoalReached ? 1 : 0,
            },
            connections: 0,
            messages: 0,
            hasShownConfetti: false,
          },
        });
      })
    );

    return NextResponse.json(
      { message: "Streaks updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating streaks" },
      { status: 500 }
    );
  }
}
