"use server";

import { parseWithZod } from "@conform-to/zod/v4";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { articleSchema } from "@/lib/zodSchema";

export async function createArticleAction(
  siteId: string,
  _: unknown,
  formData: FormData,
) {
  const { userId } = await requireUser();

  const submission = parseWithZod(formData, {
    schema: articleSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
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
      return submission.reply({
        formErrors: ["Site not found"],
      });
    }

    const existingPost = await prisma.post.findUnique({
      where: {
        slug: submission.value.slug,
      },
      select: {
        id: true,
      },
    });

    if (existingPost) {
      return submission.reply({
        fieldErrors: {
          slug: ["This slug is already taken"],
        },
      });
    }

    await prisma.post.create({
      data: {
        title: submission.value.title,
        slug: submission.value.slug,
        smallDescription: submission.value.smallDescription,
        articleContent: submission.value.articleContent,
        image: submission.value.image,
        userId,
        siteId,
      },
    });
  } catch {
    return submission.reply({
      formErrors: ["Could not create article. Check Neon and try again."],
    });
  }

  redirect(`/dashboard/sites/${siteId}?articleCreated=1`);
}
