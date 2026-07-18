import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileIcon, PlusCircleIcon } from "lucide-react";
import Link from "next/link";

export default function SiteRoute() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full justify-end">
        <Link
          href="/dashboard/sites/new"
          className={cn(buttonVariants({ variant: "default" }), "gap-2")}
        >
          <PlusCircleIcon className="size-4" />
          <span>Create Site</span>
        </Link>
      </div>
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-md border border-dashed p-10 text-center animate-in fade-in-50">
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
          className={cn(buttonVariants({ variant: "default" }), "gap-2")}
        >
          <PlusCircleIcon className="size-4" />
          <span>Create Site</span>
        </Link>
      </div>
    </div>
  );
}
