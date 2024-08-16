import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { activityId: string } }
) {
  const activity = await prisma.activity.findUnique({
    where: {
      id: params.activityId,
    },
  });

  if (!activity)
    return new NextResponse(
      JSON.stringify({ success: false, message: "No Activity Found" }),
      { status: 404, headers: { "content-type": "application/json" } }
    );

  return NextResponse.json(activity);
}
