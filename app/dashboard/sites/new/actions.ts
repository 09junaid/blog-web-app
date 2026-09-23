"use server";

import { parseWithZod } from "@conform-to/zod/v4";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { siteSchema } from "@/lib/zodSchema";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createSiteAction(_: unknown, formData: FormData) {
  const auth = await requireUser();

  const submission = parseWithZod(formData, {
    schema: siteSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    const existingSite = await prisma.site.findUnique({
      where: {
        subdirectory: submission.value.subdirectory,
      },
      select: {
        id: true,
      },
    });

    if (existingSite) {
      return submission.reply({
        fieldErrors: {
          subdirectory: ["This subdirectory is already taken"],
        },
      });
    }

    const user = await currentUser();

    await prisma.user.upsert({
      where: {
        id: auth.userId,
      },
      update: {
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        profileImage: user?.imageUrl ?? "",
      },
      create: {
        id: auth.userId,
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        profileImage: user?.imageUrl ?? "",
      },
    });

    await prisma.site.create({
      data: {
        name: submission.value.name,
        subdirectory: submission.value.subdirectory,
        description: submission.value.description,
        imageUrl: submission.value.imageUrl,
        userId: auth.userId,
      },
    });
  } catch {
    return submission.reply({
      formErrors: [
        "Could not connect to Neon. Check your DATABASE_URL and try again.",
      ],
    });
  }

  redirect("/dashboard/sites?created=1");
}
