import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode } from "react";
import { DashboardItems } from "../components/dashboard/DashboardItems";
import { MobileSidebar } from "../components/dashboard/MobileSidebar";
import { ThemeToggle } from "../components/dashboard/ThemeToggle";
import { requireUser } from "@/lib/auth";
import { BrandLogo } from "@/components/brand-logo";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireUser();

  return (
    <section
      className="grid min-h-screen w-full md:grid-cols-[220px_1fr]
      lg:grid-cols-[280px_1fr]"
    >
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href={"/dashboard"} className="min-w-0">
              <BrandLogo markClassName="size-9 rounded-lg" />
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 font-medium lg:px-4">
              <DashboardItems />
            </nav>
          </div>
        </div>
      </div>
      <div className="flex min-w-0 flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <MobileSidebar />
          <Link href="/dashboard" className="min-w-0 md:hidden">
            <BrandLogo markClassName="size-8 rounded-lg" />
          </Link>
          <div className="ml-auto flex items-center gap-x-5">
            <ThemeToggle />
            <UserButton />
          </div>
        </header>
        <main className="min-w-0 flex-1 overflow-hidden p-4 lg:p-6">
          {children}
        </main>
      </div>
    </section>
  );
}
