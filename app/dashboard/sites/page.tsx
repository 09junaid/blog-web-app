import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import {
  AlertTriangleIcon,
  ArrowUpRightIcon,
  CalendarDaysIcon,
  FileIcon,
  PlusCircleIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SiteCreatedToast } from "./SiteCreatedToast";

export default async function SiteRoute({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const params = await searchParams;
  const { userId } = await requireUser();
  const { sites, error } = await getUserSites(userId);

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <SiteCreatedToast show={params.created === "1"} />

      <div className="flex w-full justify-end">
        <Link
          href="/dashboard/sites/new"
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full gap-2 sm:w-auto",
          )}
        >
          <PlusCircleIcon className="size-4" />
          <span>Create Site</span>
        </Link>
      </div>

      {error ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-md border border-dashed p-10 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangleIcon className="size-8 text-destructive" />
          </div>
          <h2 className="mt-5 text-lg font-semibold">
            Could not load your sites
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Prisma could not read from Neon. Check your DATABASE_URL and make
            sure the latest migration has been run.
          </p>
        </div>
      ) : sites.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {sites.map((site) => (
            <div
              key={site.id}
              className="group overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm ring-1 ring-transparent transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md hover:ring-primary/10"
            >
              <div className="p-3 pb-0">
                <div className="relative aspect-video overflow-hidden rounded-md border bg-muted/50">
                  <Image
                    src={site.imageUrl ?? "/site-wireframe.svg"}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute left-3 top-3 rounded-full border bg-background/85 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm backdrop-blur">
                    Draft
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="min-w-0 space-y-1.5">
                  <h2 className="truncate text-base font-semibold leading-none tracking-tight">
                    {site.name}
                  </h2>
                  <p className="truncate text-sm text-muted-foreground">
                    /{site.subdirectory}
                  </p>
                </div>

                {site.description ? (
                  <p className="line-clamp-2 min-h-11 text-sm leading-5 text-muted-foreground">
                    {site.description}
                  </p>
                ) : null}

                <div className="flex flex-col gap-3 border-t pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDaysIcon className="size-3.5" />
                    {site.createdAt.toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <Link
                    href={`/dashboard/sites/${site.id}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-8 w-full shrink-0 gap-1.5 border-primary/15 bg-background/80 px-3 shadow-sm hover:bg-primary hover:text-primary-foreground sm:w-auto",
                    )}
                  >
                    View article
                    <ArrowUpRightIcon className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-6 text-center animate-in fade-in-50 sm:min-h-[320px] sm:p-10">
          <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
            <FileIcon className="size-10 text-primary" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">
            You do not have any sites created
          </h2>
          <p className="mb-8 mt-2 text-center text-sm leading-tight text-muted-foreground max-w-sm mx-auto">
            You currently dont have any Sites. Please create some so that you can
            see them right here!
          </p>
          <Link
            href="/dashboard/sites/new"
            className={cn(
              buttonVariants({ variant: "default" }),
              "w-full gap-2 sm:w-auto",
            )}
          >
            <PlusCircleIcon className="size-4" />
            <span>Create Site</span>
          </Link>
        </div>
      )}
    </div>
  );
}

async function getUserSites(userId: string) {
  try {
    const sites = await prisma.site.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        subdirectory: true,
        description: true,
        imageUrl: true,
        createdAt: true,
      },
    });

    return { sites, error: null };
  } catch (error) {
    console.warn("Failed to load sites from database");
    return { sites: [], error };
  }
}
