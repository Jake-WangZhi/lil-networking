import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { differenceInDays } from 'date-fns';
import { sendPushNotification } from '@/helper/PushNotificationHelper';

export async function GET(request: NextRequest){
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (key !== process.env.CRON_KEY) {
    return NextResponse.json(null, { status: 404 });
  }

  try {
    const meetGoalNotificationsCollection = await prisma.notificationSettings.findMany({
      where: { meetGoal: true },
      select: {
        subscriptionId: true,
      },
    });

    for (const notifications of meetGoalNotificationsCollection) {
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
      });

      if (!goals) continue;

      const contacts = await prisma.contact.findMany({
        where: {
          userId: subscription.userId,
        },
      });

      const contactIds = contacts.map((c) => c.id);

      const user = await prisma.user.findUnique({
        where: { id: subscription.userId },
        select: {
          name: true,
          createdAt: true,
        },
      });

      if (!user) continue;

      const notificationData = {
        title: `Meet Goal Reminder`,
        body: `Hey, ${user.name?.split(" ")[0]}! You haven't been active in a week. Get back on the app and build those habits!`,
      };

      const activity = await prisma.activity.findFirst({
        where: {
          contactId: { in: contactIds },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          createdAt: true,
        },
      });

      // If there are no activities, use the creation date of the user.
      const dayDiff = differenceInDays(
        new Date(),
        activity ? activity.createdAt : user.createdAt
      );

      if (dayDiff !== 0 && dayDiff % 7 === 0) {
        await sendPushNotification(subscription, notificationData);
      }
    }

    return NextResponse.json({ message: "Meet goal push notifications sent successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error sending meet goal push notifications" }, { status: 500 });
  }
}
