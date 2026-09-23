import { SmartBackButton } from "@/components/smart-back-button";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsIcon } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { DeleteSiteSection } from "./DeleteSiteSection";

export default async function SiteSettingsRoute({
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
      description: true,
      imageUrl: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  if (!site) {
    notFound();
  }

  return (
    <div className="flex min-w-0 w-full flex-col gap-6">
      <div className="flex items-start gap-3 sm:gap-4">
        <SmartBackButton
          fallbackHref={`/dashboard/sites/${site.id}`}
          ariaLabel="Back to site"
        />
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Site Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Review site details and publishing configuration.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="relative aspect-video bg-muted">
            <Image
              src={site.imageUrl ?? "/site-wireframe.svg"}
              alt=""
              fill
              className="object-cover"
              sizes="420px"
              unoptimized
            />
          </div>
          <div className="space-y-2 p-5">
            <h2 className="text-lg font-semibold">{site.name}</h2>
            <p className="text-sm text-muted-foreground">{site.description}</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm sm:p-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <SettingsIcon className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Publishing Details</h2>
              <p className="text-sm text-muted-foreground">
                Basic read-only settings for now.
              </p>
            </div>
          </div>

          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border bg-muted/20 p-4">
              <dt className="text-xs font-medium uppercase text-muted-foreground">
                Public URL
              </dt>
              <dd className="mt-1 text-sm font-medium">/{site.subdirectory}</dd>
            </div>
            <div className="rounded-lg border bg-muted/20 p-4">
              <dt className="text-xs font-medium uppercase text-muted-foreground">
                Articles
              </dt>
              <dd className="mt-1 text-sm font-medium">{site._count.posts}</dd>
            </div>
            <div className="rounded-lg border bg-muted/20 p-4">
              <dt className="text-xs font-medium uppercase text-muted-foreground">
                Created
              </dt>
              <dd className="mt-1 text-sm font-medium">
                {site.createdAt.toLocaleDateString("en", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <DeleteSiteSection
        articleCount={site._count.posts}
        siteId={site.id}
        siteName={site.name}
      />
    </div>
  );
}
