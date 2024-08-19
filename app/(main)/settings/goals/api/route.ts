import prisma from "@/lib/prisma";
import { GoalsArgs, SearchParams } from "@/types";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get(SearchParams.Email);
  const goalsArgs: GoalsArgs = await request.json();

  if (!email)
    return new NextResponse(
      JSON.stringify({ success: false, message: "Missing Email" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user)
    return new NextResponse(
      JSON.stringify({ success: false, message: "No User Found" }),
      { status: 404, headers: { "content-type": "application/json" } }
    );

  const { goalConnections, goalMessages } = goalsArgs;

  const newGoals = await prisma.goals.upsert({
    where: {
      userId: user.id,
    },
    create: {
      userId: user.id,
      goalConnections,
      goalMessages,
    },
    update: {
      goalConnections,
      goalMessages,
      hasShownConfetti: false,
    },
  });

  return NextResponse.json(newGoals);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get(SearchParams.Email);

  if (!email)
    return new NextResponse(
      JSON.stringify({ success: false, message: "Missing Email" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user)
    return new NextResponse(
      JSON.stringify({ success: false, message: "No User Found" }),
      { status: 404, headers: { "content-type": "application/json" } }
    );

  const goals = await prisma.goals.findUnique({
    where: {
      userId: user.id,
    },
  });

  return NextResponse.json(goals);
}
