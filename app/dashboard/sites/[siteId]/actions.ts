"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function deleteArticleAction(siteId: string, postId: string) {
  const { userId } = await requireUser();

  const deletedPost = await prisma.post.deleteMany({
    where: {
      id: postId,
      siteId,
      userId,
    },
  });

  if (!deletedPost.count) {
    redirect(`/dashboard/sites/${siteId}`);
  }

  revalidatePath(`/dashboard/sites/${siteId}`);
  redirect(`/dashboard/sites/${siteId}?articleDeleted=1`);
}
