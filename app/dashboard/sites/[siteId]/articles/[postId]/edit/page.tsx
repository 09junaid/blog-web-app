import type { JSONContent } from "@tiptap/react";
import { SmartBackButton } from "@/components/smart-back-button";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditArticleForm } from "./EditArticleForm";

const fallbackArticleContent: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};

export default async function EditArticleRoute({
  params,
}: {
  params: Promise<{ postId: string; siteId: string }>;
}) {
  const { postId, siteId } = await params;
  const { userId } = await requireUser();

  const article = await prisma.post.findFirst({
    where: {
      id: postId,
      siteId,
      userId,
    },
    select: {
      title: true,
      slug: true,
      smallDescription: true,
      image: true,
      articleContent: true,
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="flex min-w-0 w-full flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3 sm:gap-4">
          <SmartBackButton
            fallbackHref={`/dashboard/sites/${siteId}`}
            ariaLabel="Back to articles"
          />
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Edit Article
            </h1>
            <p className="text-sm text-muted-foreground">
              Update your article details, image, and content.
            </p>
          </div>
        </div>

        <Link
          href={`/dashboard/sites/${siteId}/articles/${postId}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full gap-2 sm:w-auto",
          )}
        >
          <EyeIcon className="size-4" />
          View article
        </Link>
      </div>

      <EditArticleForm
        siteId={siteId}
        postId={postId}
        article={{
          title: article.title,
          slug: article.slug,
          smallDescription: article.smallDescription,
          image: article.image,
          articleContent: isJsonContent(article.articleContent)
            ? article.articleContent
            : fallbackArticleContent,
        }}
      />
    </div>
  );
}

function isJsonContent(value: unknown): value is JSONContent {
  return typeof value === "object" && value !== null;
}
