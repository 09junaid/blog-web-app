import { SmartBackButton } from "@/components/smart-back-button";
import { CreateArticleForm } from "./CreateArticleForm";

export default async function NewArticleRoute({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex items-start gap-3 border-b pb-5 sm:gap-4 sm:pb-6">
        <SmartBackButton
          fallbackHref={`/dashboard/sites/${siteId}`}
          className="mt-0.5 shrink-0 bg-background/80 shadow-sm"
          ariaLabel="Back to site"
        />

        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Create Article
          </h1>
          <p className="text-sm text-muted-foreground">
            Write and publish a new article for this site.
          </p>
        </div>
      </div>

      <CreateArticleForm siteId={siteId} />
    </div>
  );
}
