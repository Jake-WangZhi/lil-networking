import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendPushNotification } from '@/helper/PushNotificationHelper';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (key !== process.env.CRON_KEY) {
    return NextResponse.json(null, { status: 404 });
  }

  try {
    const streakNotificationsCollection = await prisma.notificationSettings.findMany({
      where: { streak: true },
      select: {
        subscriptionId: true,
      },
    });

    for (const notifications of streakNotificationsCollection) {
      const subscription = await prisma.subscription.findUnique({
        where: {
          id: notifications.subscriptionId,
        },
      });

      if (!subscription) continue;

      const goals = await prisma.goals.findUnique({
        where: {
          userId: subscription.userId,
        },
        select: {
          messages: true,
          connections: true,
          goalConnections: true,
          goalMessages: true,
        },
      });

      if (!goals) continue;

      const { connections, goalConnections, messages, goalMessages } = goals;

      if (connections < goalConnections || messages < goalMessages) {
        const user = await prisma.user.findUnique({
          where: { id: subscription.userId },
          select: {
            name: true,
          },
        });

        if (!user) continue;

        const notificationData = {
          title: `Streak Reminder`,
          body: `Hi, ${user.name?.split(" ")[0]}, make sure to meet your goals by the end of the month to keep your current streak!`,
        };

        await sendPushNotification(subscription, notificationData);
      }
    }

    return NextResponse.json({ message: "Streak push notifications sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending streak push notifications:", error);
    return NextResponse.json({ error: "Error sending streak push notifications" }, { status: 500 });
  }
}
