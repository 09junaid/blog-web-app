"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function deleteSiteAction(siteId: string) {
  const { userId } = await requireUser();

  const site = await prisma.site.findFirst({
    where: {
      id: siteId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!site) {
    redirect("/dashboard/sites");
  }

  await prisma.$transaction([
    prisma.post.deleteMany({
      where: {
        siteId,
        userId,
      },
    }),
    prisma.site.delete({
      where: {
        id: siteId,
      },
    }),
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/sites");
  redirect("/dashboard/sites");
}
