import { ArticleContentRenderer } from "@/components/article-content-renderer";
import { prisma } from "@/lib/prisma";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PublicArticleRoute({
  params,
}: {
  params: Promise<{ slug: string; subdirectory: string }>;
}) {
  const { slug, subdirectory } = await params;

  const post = await prisma.post.findFirst({
    where: {
      slug,
      site: {
        subdirectory,
      },
    },
    select: {
      title: true,
      smallDescription: true,
      image: true,
      articleContent: true,
      createdAt: true,
      site: {
        select: {
          name: true,
          subdirectory: true,
        },
      },
    },
  });

  if (!post?.site) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href={`/${post.site.subdirectory}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="size-4" />
            Back to {post.site.name}
          </Link>
        </div>
      </header>

      <article>
        <section className="border-b">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:px-8 lg:py-14">
            <div className="flex flex-col justify-center">
              <p className="text-sm text-muted-foreground">
                {post.createdAt.toLocaleDateString("en", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight lg:text-6xl">
                {post.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground lg:text-lg">
                {post.smallDescription}
              </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted shadow-sm lg:aspect-auto lg:min-h-[360px]">
              <Image
                src={post.image}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 460px, 100vw"
                unoptimized
                priority
              />
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <ArticleContentRenderer content={post.articleContent} />
        </section>
      </article>
    </main>
  );
}
