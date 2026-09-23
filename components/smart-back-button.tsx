"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SmartBackButtonProps = {
  ariaLabel: string;
  className?: string;
  fallbackHref: string;
};

export function SmartBackButton({
  ariaLabel,
  className,
  fallbackHref,
}: SmartBackButtonProps) {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(
        buttonVariants({ variant: "outline", size: "icon" }),
        "cursor-pointer",
        className,
      )}
      onClick={goBack}
    >
      <ArrowLeftIcon className="size-4" />
    </button>
  );
}
