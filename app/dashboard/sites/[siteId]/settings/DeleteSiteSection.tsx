"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangleIcon, Loader2Icon, Trash2Icon, XIcon } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { deleteSiteAction } from "./actions";

type DeleteSiteSectionProps = {
  articleCount: number;
  siteId: string;
  siteName: string;
};

export function DeleteSiteSection({
  articleCount,
  siteId,
  siteName,
}: DeleteSiteSectionProps) {
  const action = deleteSiteAction.bind(null, siteId);

  return (
    <div className="rounded-xl border border-destructive/25 bg-card p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
            <AlertTriangleIcon className="size-5 text-destructive" />
          </div>
          <div>
            <h2 className="font-semibold">Danger Zone</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              Delete this site and all of its articles. This action is permanent
              and can only be done by the creator.
            </p>
          </div>
        </div>

        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button variant="destructive" className="w-full cursor-pointer gap-2 sm:w-auto">
              <Trash2Icon className="size-4" />
              Delete Site
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card p-6 text-card-foreground shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <Dialog.Title className="text-lg font-semibold">
                    Delete this site?
                  </Dialog.Title>
                  <Dialog.Description className="text-sm leading-6 text-muted-foreground">
                    This will permanently delete{" "}
                    <span className="font-medium text-foreground">
                      {siteName}
                    </span>{" "}
                    and all related articles.
                  </Dialog.Description>
                </div>
                <Dialog.Close className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <XIcon className="size-4" />
                </Dialog.Close>
              </div>

              <div className="mt-5 rounded-lg border bg-muted/25 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10">
                    <Trash2Icon className="size-5 text-destructive" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{siteName}</p>
                    <p className="text-xs text-muted-foreground">
                      {articleCount} articles will also be removed.
                    </p>
                  </div>
                </div>
              </div>

              <form action={action} className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Dialog.Close asChild>
                  <Button type="button" variant="outline" className="w-full sm:w-auto">
                    Cancel
                  </Button>
                </Dialog.Close>
                <DeleteButton />
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="destructive"
      disabled={pending}
      className="w-full cursor-pointer gap-2 sm:w-auto"
    >
      {pending ? (
        <>
          <Loader2Icon className="size-4 animate-spin" />
          Deleting...
        </>
      ) : (
        "Delete forever"
      )}
    </Button>
  );
}
