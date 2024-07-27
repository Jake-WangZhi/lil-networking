import { NextResponse } from "next/server";
import prisma from "~/lib/prisma";

export async function GET(request: Request) {
  //Keep this line to prevent the function from being cached
  //To ensure it returns a different quote randomly with each request.
  const { searchParams } = new URL(request.url);

  const count = await prisma.quote.count();
  const skip = Math.floor(Math.random() * count);
  const quote = await prisma.quote.findFirst({
    skip,
  });

  return NextResponse.json(quote);
}
