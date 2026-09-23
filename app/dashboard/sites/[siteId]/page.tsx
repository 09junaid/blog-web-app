import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { Book, FileTextIcon, PlusCircle, SettingsIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleActions } from "./ArticleActions";

export default async function SiteIdRoute({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const { userId } = await requireUser();
  const site = await prisma.site.findFirst({
    where: {
      id: siteId,
      userId,
    },
    select: {
      id: true,
      name: true,
      subdirectory: true,
    },
  });

  if (!site) {
    notFound();
  }

  const posts = await getSitePosts(site.id, userId);

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{site.name}</h1>
          <p className="text-sm text-muted-foreground">/{site.subdirectory}</p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
          <Link
            href={`/${site.subdirectory}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full gap-2 border-primary/15 bg-background/80 shadow-sm hover:bg-primary hover:text-primary-foreground sm:w-auto",
            )}
          >
            <Book className="size-4" />
            View Blog
          </Link>

          <Link
            href={`/dashboard/sites/${site.id}/settings`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full gap-2 border-primary/15 bg-background/80 shadow-sm hover:bg-primary hover:text-primary-foreground sm:w-auto",
            )}
          >
            <SettingsIcon className="size-4" />
            Settings
          </Link>

          <Link
            href={`/dashboard/sites/${site.id}/articles/new`}
            className={cn(buttonVariants(), "w-full gap-2 shadow-sm sm:w-auto")}
          >
            <PlusCircle className="size-4" />
            Create Article
          </Link>
        </div>
      </div>

      {posts.length > 0 ? (
        <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="border-b px-5 py-4">
            <h2 className="text-lg font-semibold">Articles</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your articles in a simple and intuitive interface.
            </p>
          </div>

          <div className="grid gap-3 p-3 md:hidden">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-lg border bg-background p-3 shadow-sm"
              >
                <div className="flex gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold">{post.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {post.smallDescription}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-500">
                        Published
                      </span>
                      <span>
                        {post.createdAt.toLocaleDateString("en", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <ArticleActions
                    postId={post.id}
                    siteId={site.id}
                    title={post.title}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="w-[120px] px-5 py-3 text-left font-medium">
                    Image
                  </th>
                  <th className="px-5 py-3 text-left font-medium">Title</th>
                  <th className="w-[140px] px-5 py-3 text-left font-medium">
                    Status
                  </th>
                  <th className="w-[170px] px-5 py-3 text-left font-medium">
                    Created At
                  </th>
                  <th className="w-[90px] px-5 py-3 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="transition-colors hover:bg-muted/20"
                  >
                    <td className="px-5 py-4">
                      <div className="relative size-16 overflow-hidden rounded-md border bg-muted">
                        <Image
                          src={post.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="64px"
                          unoptimized
                        />
                      </div>
                    </td>
                    <td className="max-w-[360px] px-5 py-4">
                      <div className="space-y-1">
                        <h3 className="truncate font-semibold">
                          {post.title}
                        </h3>
                        <p className="line-clamp-1 text-sm text-muted-foreground">
                          {post.smallDescription}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-500">
                        Published
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {post.createdAt.toLocaleDateString("en", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <ArticleActions
                        postId={post.id}
                        siteId={site.id}
                        title={post.title}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center sm:min-h-[300px] sm:p-10">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
            <FileTextIcon className="size-8 text-primary" />
          </div>
          <h2 className="mt-5 text-lg font-semibold">No articles yet</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Create your first article for this site and it will appear here.
          </p>
          <Link
            href={`/dashboard/sites/${site.id}/articles/new`}
            className={cn(buttonVariants(), "mt-6 w-full gap-2 sm:w-auto")}
          >
            <PlusCircle className="size-4" />
            Create Article
          </Link>
        </div>
      )}
    </div>
  );
}

async function getSitePosts(siteId: string, userId: string) {
  if (!prisma.post) {
    return [];
  }

  try {
    return await prisma.post.findMany({
      where: {
        siteId,
        userId,
      },
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
    });
  } catch {
    return [];
  }
}
