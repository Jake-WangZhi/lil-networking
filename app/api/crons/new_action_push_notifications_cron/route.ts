import prisma from "@/lib/prisma";
import { differenceInDays } from "date-fns";
import { sendPushNotification } from "@/helper/PushNotificationHelper";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (key !== process.env.CRON_KEY) {
    return new Response(null, { status: 404 });
  }

  try {
    const newActionNotificationsCollection = await prisma.notificationSettings.findMany({
      where: { newAction: true },
      select: {
        subscriptionId: true,
      },
    });

    for (const notifications of newActionNotificationsCollection) {
      const subscription = await prisma.subscription.findUnique({
        where: {
          id: notifications.subscriptionId,
        },
      });

      if (!subscription) continue;

      const contacts = await prisma.contact.findMany({
        where: {
          userId: subscription.userId,
          isArchived: false,
        },
        select: {
          id: true,
          firstName: true,
          goalDays: true,
        },
      });

      for (const contact of contacts) {
        const { id, firstName, goalDays } = contact;

        const activity = await prisma.activity.findFirst({
          where: {
            contactId: id,
            type: "USER",
          },
          orderBy: [
            {
              date: "desc",
            },
            {
              createdAt: "desc",
            },
          ],
          select: {
            date: true,
          },
        });

        if (activity) {
          const activityDate = new Date(activity.date);
          const dayDiff = differenceInDays(new Date(), activityDate);

          if (dayDiff === goalDays) {
            const notificationData = {
              title: `New Action Alert`,
              body: `${firstName} has been added to new actions. Reach out today!`,
            };

            await sendPushNotification(subscription, notificationData);
          }
        }
      }
    }

    return new Response(JSON.stringify({ message: "New action push notifications sent successfully" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error sending new action push notifications" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
