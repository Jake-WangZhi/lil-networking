import { NotificationSettingsArgs, SearchParams } from "@/types";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get(SearchParams.Endpoint);

  if (!endpoint)
    return new NextResponse(
      JSON.stringify({ success: false, message: "Missing endpoint" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );

  const subscription = await prisma.subscription.findUnique({
    where: { endpoint },
  });

  if (!subscription)
    return new NextResponse(
      JSON.stringify({ success: false, message: "No such subscription" }),
      { status: 400, headers: { "content-type": "application/json" } }
    );

  const notificationSettings = await prisma.notificationSettings.findUnique({
    where: {
      subscriptionId: subscription.id,
    },
  });

  return NextResponse.json(notificationSettings);
}

export async function POST(request: Request) {
  const notificationSettingsArgs: NotificationSettingsArgs =
    await request.json();

  const { newAction, streak, meetGoal, subscriptionId } =
    notificationSettingsArgs;

  const newNotificationSettings = await prisma.notificationSettings.create({
    data: {
      subscriptionId,
      newAction,
      streak,
      meetGoal,
    },
  });

  return NextResponse.json(newNotificationSettings);
}

export async function PUT(request: Request) {
  const notificationSettingsArgs: NotificationSettingsArgs =
    await request.json();

  const { newAction, streak, meetGoal, subscriptionId } =
    notificationSettingsArgs;

  const newNotificationSettings = await prisma.notificationSettings.update({
    where: { subscriptionId },
    data: {
      newAction,
      streak,
      meetGoal,
    },
  });

  return NextResponse.json(newNotificationSettings);
}
