"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  EditIcon,
  EyeIcon,
  MoreHorizontalIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteArticleAction } from "./actions";

type ArticleActionsProps = {
  postId: string;
  siteId: string;
  title: string;
};

export function ArticleActions({ postId, siteId, title }: ArticleActionsProps) {
  const [open, setOpen] = useState(false);
  const deleteAction = deleteArticleAction.bind(null, siteId, postId);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Open actions for ${title}`}
          className="ml-auto flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <MoreHorizontalIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem className="p-0">
            <Link
              href={`/dashboard/sites/${siteId}/articles/${postId}`}
              className="flex w-full items-center gap-2 px-2 py-1.5"
            >
              <EyeIcon className="size-4" />
              View article
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0">
            <Link
              href={`/dashboard/sites/${siteId}/articles/${postId}/edit`}
              className="flex w-full items-center gap-2 px-2 py-1.5"
            >
              <EditIcon className="size-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Dialog.Trigger asChild>
            <DropdownMenuItem variant="destructive">
              <Trash2Icon className="size-4" />
              Delete
            </DropdownMenuItem>
          </Dialog.Trigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card p-6 text-card-foreground shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Dialog.Title className="text-lg font-semibold">
                Delete article?
              </Dialog.Title>
              <Dialog.Description className="text-sm leading-6 text-muted-foreground">
                This will permanently delete{" "}
                <span className="font-medium text-foreground">{title}</span>.
                This action cannot be undone.
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
                <p className="truncate text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">
                  Article and its content will be removed.
                </p>
              </div>
            </div>
          </div>

          <form action={deleteAction} className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="destructive"
      disabled={pending}
      className="w-full sm:w-auto"
    >
      {pending ? "Deleting..." : "Delete article"}
    </Button>
  );
}
