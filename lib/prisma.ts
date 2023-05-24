import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createContact({
  name,
  title,
  company,
  industry,
  goalDays,
  email,
  phone,
  links,
  userId,
}: {
  name: string;
  title: string;
  company: string;
  industry: string;
  goalDays: number;
  email: string;
  phone: string;
  links: string[];
  userId: string;
}) {
  const contact = await prisma.contact.create({
    data: {
      name,
      title,
      company,
      industry,
      goalDays,
      email,
      phone,
      links,
      userId,
    },
  });

  // if (note)
  //   await prisma.activity.create({
  //     data: {
  //       contactId: contact.id,
  //       note,
  //     },
  //   });
}

export default prisma;
