import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import prisma from "@/lib/prisma";

webpush.setVapidDetails(
  process.env.VAPID_MAILTO ?? "",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "",
  process.env.VAPID_PRIVATE_KEY ?? ""
);

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (key !== process.env.CRON_KEY) {
    return NextResponse.json(null, { status: 404 });
  }

  try {
    const subscriptionData = await prisma.subscription.findMany();

    const notificationData = {
      title: "❤嫄嫄",
      body: "From之之",
    };

    for (const { endpoint, p256dh, auth, id } of subscriptionData) {
      try {
        await webpush.sendNotification(
          { endpoint, keys: { p256dh, auth } },
          JSON.stringify(notificationData)
        );
      } catch (error: any) {
        console.error("Error sending push notification:", error);
        if (error.statusCode === 410) {
          // Clean out unsubscribed or expired push subscriptions.
          await prisma.notificationSettings.delete({
            where: { subscriptionId: id },
          });
          await prisma.subscription.delete({ where: { id } });
        }

        continue;
      }
    }

    return NextResponse.json(
      { message: "Push notifications sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error sending push notifications" },
      { status: 500 }
    );
  }
}
