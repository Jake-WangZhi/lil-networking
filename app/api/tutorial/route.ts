import prisma from "@/lib/prisma";
import { SearchParams, TutorialArgs, TutorialType } from "@/types";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get(SearchParams.Email);
  const tutorialArgs: TutorialArgs = await request.json();

  if (!email)
    return new NextResponse(
      JSON.stringify({ success: false, message: "Missing Email" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );

  const updateData: any = {};

  switch (tutorialArgs.type) {
    case TutorialType.Dashboard:
      updateData.hasViewedDashboardTutorial = Boolean(tutorialArgs.status);
      break;
    case TutorialType.Contacts:
      updateData.hasViewedContactsTutorial = Boolean(tutorialArgs.status);

      break;
    case TutorialType.Profile:
      updateData.hasViewedProfileTutorial = Boolean(tutorialArgs.status);
      break;
  }

  const user = await prisma.user.update({
    where: { email },
    data: updateData,
  });

  return NextResponse.json(user);
}
