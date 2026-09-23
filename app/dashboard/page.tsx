import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import {
  AlertTriangleIcon,
  ArrowUpRightIcon,
  Clock3Icon,
  FileIcon,
  FileTextIcon,
  PlusCircleIcon,
  SparklesIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export default async function DashboardIndexPage() {
  const { userId } = await requireUser();
  const { recentPosts, sites, error } = await getDashboardData(userId);
  const totalArticles = sites.reduce(
    (total, site) => total + site._count.posts,
    0,
  );

  return (
    <div className="flex min-w-0 flex-col gap-6 sm:gap-8">
      <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              <SparklesIcon className="size-3.5 text-primary" />
              Publishing overview
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Dashboard
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Track your sites, recent publishing activity, and jump back into
              article work from one clean workspace.
            </p>
          </div>

          <Link
            href="/dashboard/sites/new"
            className={cn(
              buttonVariants(),
              "w-full gap-2 sm:w-auto lg:self-center",
            )}
          >
            <PlusCircleIcon className="size-4" />
            Create Site
          </Link>
        </div>
      </div>

      {error ? (
        <DashboardError />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              icon={<FileIcon className="size-5" />}
              label="Total sites"
              value={sites.length}
            />
            <StatCard
              icon={<FileTextIcon className="size-5" />}
              label="Total articles"
              value={totalArticles}
            />
            <StatCard
              icon={<Clock3Icon className="size-5" />}
              label="Recent articles"
              value={recentPosts.length}
            />
          </div>

          <section className="min-w-0 space-y-4 rounded-xl border bg-card/50 p-4 shadow-sm lg:p-5">
            <SectionHeader
              title="Your Sites"
              description="Open a site to manage articles, settings, and publishing."
              href="/dashboard/sites"
              action="View all"
            />

            {sites.length ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {sites.map((site) => (
                  <Link
                    key={site.id}
                    href={`/dashboard/sites/${site.id}`}
                    className="group overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm ring-1 ring-transparent transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md hover:ring-primary/10"
                  >
                    <div className="relative aspect-video bg-muted">
                      <Image
                        src={site.imageUrl ?? "/site-wireframe.svg"}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/45 via-transparent to-transparent opacity-80" />
                      <div className="absolute left-3 top-3 rounded-full border bg-background/85 px-2.5 py-1 text-[11px] font-medium shadow-sm backdrop-blur">
                        {site._count.posts} articles
                      </div>
                    </div>
                    <div className="space-y-3 p-4">
                      <div className="min-w-0 space-y-1">
                        <h2 className="truncate font-semibold">{site.name}</h2>
                        <p className="truncate text-sm text-muted-foreground">
                          /{site.subdirectory}
                        </p>
                      </div>
                      <p className="line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                        {site.description}
                      </p>
                      <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                        <span>Updated workspace</span>
                        <span className="inline-flex items-center gap-1 text-primary">
                          Open
                          <ArrowUpRightIcon className="size-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptySection
                action="Create Site"
                description="You currently do not have any sites. Create one so articles have a home."
                href="/dashboard/sites/new"
                icon={<FileIcon className="size-10 text-primary" />}
                title="You do not have any sites created"
              />
            )}
          </section>

          <section className="min-w-0 space-y-4 rounded-xl border bg-card/50 p-4 shadow-sm lg:p-5">
            <SectionHeader
              title="Recent Articles"
              description="Your newest articles across all sites."
            />

            {recentPosts.length ? (
              <>
                <div className="grid gap-3 md:hidden">
                  {recentPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/dashboard/sites/${post.siteId}/articles/${post.id}`}
                      className="flex gap-3 rounded-lg border bg-card p-3 shadow-sm transition-colors hover:bg-muted/30"
                    >
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
                        <h3 className="truncate font-semibold">
                          {post.title}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                          {post.smallDescription}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{post.site?.name ?? "Untitled site"}</span>
                          <span>/</span>
                          <span>
                            {post.createdAt.toLocaleDateString("en", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="hidden overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm md:block">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-sm">
                    <thead className="border-b bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="w-[120px] px-5 py-3 text-left font-medium">
                          Image
                        </th>
                        <th className="px-5 py-3 text-left font-medium">
                          Title
                        </th>
                        <th className="w-[180px] px-5 py-3 text-left font-medium">
                          Site
                        </th>
                        <th className="w-[170px] px-5 py-3 text-left font-medium">
                          Created At
                        </th>
                        <th className="w-[120px] px-5 py-3 text-right font-medium">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {recentPosts.map((post) => (
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
                              <p className="line-clamp-1 text-muted-foreground">
                                {post.smallDescription}
                              </p>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-muted-foreground">
                            {post.site?.name ?? "Untitled site"}
                          </td>
                          <td className="px-5 py-4 text-muted-foreground">
                            {post.createdAt.toLocaleDateString("en", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <Link
                              href={`/dashboard/sites/${post.siteId}/articles/${post.id}`}
                              className={cn(
                                buttonVariants({
                                  variant: "outline",
                                  size: "sm",
                                }),
                                "gap-1.5",
                              )}
                            >
                              View
                              <ArrowUpRightIcon className="size-3.5" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <EmptySection
                description={
                  sites.length
                    ? "No articles yet. Open one of your sites and create your first article."
                    : "Create a site first, then your recent articles will appear here."
                }
                icon={<FileTextIcon className="size-10 text-primary" />}
                title="No recent articles"
              />
            )}
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  action,
  description,
  href,
  title,
}: {
  action?: string;
  description: string;
  href?: string;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {href && action ? (
        <Link
          href={href}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "w-full sm:w-auto",
          )}
        >
          {action}
        </Link>
      ) : null}
    </div>
  );
}

function EmptySection({
  action,
  description,
  href,
  icon,
  title,
}: {
  action?: string;
  description: string;
  href?: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed bg-card/40 p-6 text-center sm:min-h-[280px] sm:p-10">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
        {icon}
      </div>
      <h3 className="mt-6 text-xl font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {href && action ? (
        <Link
          href={href}
          className={cn(buttonVariants(), "mt-6 w-full gap-2 sm:w-auto")}
        >
          <PlusCircleIcon className="size-4" />
          {action}
        </Link>
      ) : null}
    </div>
  );
}

function DashboardError() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangleIcon className="size-8 text-destructive" />
      </div>
      <h2 className="mt-5 text-lg font-semibold">Could not load dashboard</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Prisma could not read from Neon. Check your DATABASE_URL and make sure
        migrations are up to date.
      </p>
    </div>
  );
}

async function getDashboardData(userId: string) {
  try {
    const [sites, recentPosts] = await Promise.all([
      prisma.site.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 6,
        select: {
          id: true,
          name: true,
          subdirectory: true,
          description: true,
          imageUrl: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
      }),
      prisma.post.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          title: true,
          smallDescription: true,
          image: true,
          siteId: true,
          createdAt: true,
          site: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    return { error: null, recentPosts, sites };
  } catch (error) {
    console.warn("Failed to load dashboard data", error);
    return { error, recentPosts: [], sites: [] };
  }
}
