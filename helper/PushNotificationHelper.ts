import webpush from "web-push";
import prisma from "@/lib/prisma";
import { Subscription } from "@prisma/client";

webpush.setVapidDetails(
  process.env.VAPID_MAILTO ?? "",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "",
  process.env.VAPID_PRIVATE_KEY ?? ""
);

export const sendPushNotification = async (
  subscription: Subscription,
  notificationData: {
    title: string;
    body: string;
  }
) => {
  const { endpoint, p256dh, auth } = subscription;

  try {
    await webpush.sendNotification(
      {
        endpoint,
        keys: {
          p256dh,
          auth,
        },
      },
      JSON.stringify(notificationData)
    );
  } catch (error: any) {
    console.error("Error sending meet goal push notification:", error);
    if (error.statusCode === 410) {
      // Clean out unsubscribed or expired push subscriptions.
      await prisma.$transaction([
        prisma.notificationSettings.delete({
          where: { subscriptionId: subscription.id },
        }),
        prisma.subscription.delete({
          where: { id: subscription.id },
        }),
      ]);
    }
  }
};
