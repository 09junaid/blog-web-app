import { ArticleContentRenderer } from "@/components/article-content-renderer";
import { SmartBackButton } from "@/components/smart-back-button";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { EditIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ArticleViewRoute({
  params,
}: {
  params: Promise<{ postId: string; siteId: string }>;
}) {
  const { postId, siteId } = await params;
  const { userId } = await requireUser();

  const post = await prisma.post.findFirst({
    where: {
      id: postId,
      siteId,
      userId,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      smallDescription: true,
      image: true,
      articleContent: true,
      createdAt: true,
      site: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="flex min-w-0 w-full flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SmartBackButton
          fallbackHref={`/dashboard/sites/${siteId}`}
          ariaLabel="Back to articles"
        />

        <Link
          href={`/dashboard/sites/${siteId}/articles/${post.id}/edit`}
          className={cn(buttonVariants(), "w-full gap-2 sm:w-auto")}
        >
          <EditIcon className="size-4" />
          Edit article
        </Link>
      </div>

      <article className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="relative min-h-[300px] bg-muted sm:min-h-[360px] lg:min-h-[440px]">
          <Image
            src={post.image}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-10">
            <div className="max-w-5xl space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-md border bg-background/80 px-2 py-1 backdrop-blur">
                  {post.site?.name}
                </span>
                <span className="rounded-md border bg-background/80 px-2 py-1 backdrop-blur">
                  {post.slug}
                </span>
                <span className="rounded-md border bg-background/80 px-2 py-1 backdrop-blur">
                  {post.createdAt.toLocaleDateString("en", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h1 className="max-w-5xl text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-5xl">
                {post.title}
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7 lg:text-lg">
                {post.smallDescription}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 lg:p-10">
          <div className="max-w-5xl">
            <ArticleContentRenderer content={post.articleContent} />
          </div>
        </div>
      </article>
    </div>
  );
}
