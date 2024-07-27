import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { activityId: string } }
) {
  const activity = await prisma.activity.delete({
    where: { id: params.activityId },
  });

  return NextResponse.json(activity);
}
