"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SiteCreatedToast({ show }: { show: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!show) {
      return;
    }

    toast.success("Site created", {
      description: "Your site has been created successfully.",
    });
    router.replace("/dashboard/sites");
  }, [router, show]);

  return null;
}
