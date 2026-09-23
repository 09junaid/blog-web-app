import { SmartBackButton } from "@/components/smart-back-button";
import { prisma } from "@/lib/prisma";
import { ArrowUpRightIcon, FileTextIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PublicBlogRoute({
  params,
}: {
  params: Promise<{ subdirectory: string }>;
}) {
  const { subdirectory } = await params;

  const site = await prisma.site.findUnique({
    where: {
      subdirectory,
    },
    select: {
      name: true,
      description: true,
      imageUrl: true,
      posts: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          slug: true,
          smallDescription: true,
          image: true,
          createdAt: true,
        },
      },
    },
  });

  if (!site) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <SmartBackButton
            fallbackHref="/dashboard"
            className="bg-card text-muted-foreground shadow-sm hover:bg-muted hover:text-foreground"
            ariaLabel="Back to dashboard"
          />
          <h1 className="min-w-0 flex-1 truncate px-4 text-lg font-semibold">
            {site.name}
          </h1>
        </div>
      </header>

      <section className="border-b">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:px-8 lg:py-14">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium text-primary">/{subdirectory}</p>
            <h2 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight lg:text-6xl">
              {site.name}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground lg:text-lg">
              {site.description}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="rounded-full border bg-card px-3 py-1 shadow-sm">
                {site.posts.length} articles
              </span>
              <span className="rounded-full border bg-card px-3 py-1 shadow-sm">
                Latest writing
              </span>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted shadow-sm lg:aspect-auto lg:min-h-[360px]">
            <Image
              src={site.imageUrl ?? "/site-wireframe.svg"}
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

      <section id="articles" className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Articles</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Latest writing from this blog.
            </p>
          </div>
        </div>

        {site.posts.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {site.posts.map((post) => (
              <article
                key={post.id}
                className="group overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
              >
                <div className="relative aspect-video bg-muted">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    unoptimized
                  />
                </div>
                <div className="space-y-3 p-5">
                  <p className="text-xs text-muted-foreground">
                    {post.createdAt.toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="line-clamp-2 font-semibold">{post.title}</h3>
                  <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {post.smallDescription}
                  </p>
                  <Link
                    href={`/${subdirectory}/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
                  >
                    Read article
                    <ArrowUpRightIcon className="size-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed bg-card/40 p-10 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
              <FileTextIcon className="size-8 text-primary" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">No articles yet</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Articles published for this site will appear here.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
