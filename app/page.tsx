import {
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import {
  BarChart3,
  FileText,
  ImageUp,
  LayoutDashboard,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/app/components/dashboard/ThemeToggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const technologies = [
  { name: "Next.js", mark: "N", tone: "bg-foreground text-background" },
  { name: "React", mark: "R", tone: "bg-sky-500/15 text-sky-500" },
  { name: "TypeScript", mark: "TS", tone: "bg-blue-500/15 text-blue-600" },
  { name: "Tailwind", mark: "TW", tone: "bg-cyan-500/15 text-cyan-600" },
  { name: "Prisma", mark: "P", tone: "bg-slate-500/15 text-slate-700 dark:text-slate-200" },
  { name: "Neon", mark: "Ne", tone: "bg-emerald-500/15 text-emerald-600" },
  { name: "Clerk", mark: "C", tone: "bg-violet-500/15 text-violet-500" },
  { name: "UploadThing", mark: "UT", tone: "bg-rose-500/15 text-rose-500" },
  { name: "TipTap", mark: "T", tone: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-200" },
  { name: "shadcn/ui", mark: "S", tone: "bg-primary/15 text-primary" },
];

const features = [
  {
    title: "Launch branded blogs fast",
    description:
      "Create polished blog spaces with custom names, slugs, cover images, and clean public pages.",
    icon: Sparkles,
  },
  {
    title: "Write rich articles",
    description:
      "Compose structured posts with a focused editor, generated slugs, previews, and validation.",
    icon: FileText,
  },
  {
    title: "Upload visual covers",
    description:
      "Add article and site imagery through a refined upload flow with progress and previews.",
    icon: ImageUp,
  },
  {
    title: "Manage everything",
    description:
      "Track sites, recent articles, settings, and publishing actions from one premium dashboard.",
    icon: LayoutDashboard,
  },
  {
    title: "Secure creator workspace",
    description:
      "Clerk authentication and ownership checks keep each creator's sites and articles protected.",
    icon: LockKeyhole,
  },
  {
    title: "Insightful overview",
    description:
      "See site and article activity at a glance with clean tables, cards, and quick actions.",
    icon: BarChart3,
  },
];

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="min-w-0">
            <BrandLogo markClassName="size-9 rounded-lg" />
          </Link>

          <div className="flex items-center gap-3">
            {!userId ? (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" className="cursor-pointer">
                    Sign in
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="hidden cursor-pointer sm:inline-flex">
                    Create account
                  </Button>
                </SignUpButton>
              </>
            ) : (
              <>
                <Link href="/dashboard" className={cn(buttonVariants())}>
                  Dashboard
                </Link>
                <UserButton />
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="relative flex items-center justify-center overflow-hidden px-4 pb-10 pt-16 sm:px-6 lg:px-8 sm:pb-12 sm:pt-20">
        <div className="pointer-events-none absolute left-1/2 bottom-0 h-52 w-[min(760px,90vw)] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center text-center">
          <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary ring-1 ring-primary/15">
            Ultimate Blogging SaaS for Creators
          </div>

          <h1 className="mt-8 max-w-5xl text-balance text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl sm:leading-[0.95] lg:text-8xl">
            Setup your Blog
            <span className="block text-primary">in Minutes!</span>
          </h1>

          <p className="mt-7 max-w-2xl text-balance text-base leading-7 text-muted-foreground sm:text-lg">
            Setting up your blog is hard and time consuming. StoryGrid makes it
            easy to create, manage, and publish your blog in minutes.
          </p>

          {!userId ? (
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
              <SignInButton mode="modal">
                <Button variant="secondary" size="lg" className="cursor-pointer">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="lg" className="cursor-pointer">
                  Try for free
                </Button>
              </SignUpButton>
            </div>
          ) : (
            <div className="mt-7 flex items-center gap-3">
              <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }))}>
                Get started
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden px-4 pb-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-[min(920px,92vw)] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl dark:bg-primary/25" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-28 w-[min(680px,82vw)] -translate-x-1/2 rounded-full bg-background/80 blur-2xl dark:bg-background/70" />
        <div className="relative mx-auto w-full max-w-7xl">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl sm:aspect-[16/9] sm:rounded-2xl">
            <Image
              src="/blog-img.png"
              alt="StoryGrid dashboard preview"
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 1152px, 100vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="relative z-10 overflow-hidden bg-background px-4 pb-24 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-8 text-center">
            <p className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Trusted by modern publishing stacks
            </p>
          </div>

          <div className="relative">
            <div className="landing-logo-marquee flex w-max gap-4">
              {[...technologies, ...technologies].map((technology, index) => (
                <div
                  key={`${technology.name}-${index}`}
                  className="flex h-16 min-w-44 items-center gap-3 rounded-xl border bg-card/70 px-4 shadow-sm backdrop-blur"
                >
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-lg text-sm font-bold",
                      technology.tone,
                    )}
                  >
                    {technology.mark}
                  </span>
                  <span className="whitespace-nowrap text-sm font-semibold text-card-foreground">
                    {technology.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-5 w-fit rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary ring-1 ring-primary/15">
              Features
            </div>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              Everything you need to publish with confidence
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
              StoryGrid keeps the writing flow, media management, and dashboard
              controls clean so creators can move from idea to published blog
              without friction.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:mt-12 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="mb-6 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-5 text-sm text-muted-foreground sm:flex-row">
          <BrandLogo markClassName="size-8 rounded-lg" />
          <p>&copy; 2026 StoryGrid. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

