"use server";

import { parseWithZod } from "@conform-to/zod/v4";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { articleSchema } from "@/lib/zodSchema";

export async function updateArticleAction(
  siteId: string,
  postId: string,
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
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        siteId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!post) {
      return submission.reply({
        formErrors: ["Article not found"],
      });
    }

    const existingPost = await prisma.post.findFirst({
      where: {
        slug: submission.value.slug,
        NOT: {
          id: postId,
        },
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

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title: submission.value.title,
        slug: submission.value.slug,
        smallDescription: submission.value.smallDescription,
        articleContent: submission.value.articleContent,
        image: submission.value.image,
      },
    });
  } catch {
    return submission.reply({
      formErrors: ["Could not update article. Check Neon and try again."],
    });
  }

  redirect(`/dashboard/sites/${siteId}/articles/${postId}`);
}
