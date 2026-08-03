import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SendHorizontal } from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

export default function NewSiteRoute() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create Site</CardTitle>
          <CardDescription>
            Create your site here. Click the button below when you are done.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-y-6">
            <div className="grid gap-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input placeholder="My awesome blog" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="site-name">Subdirectory</Label>
              <Input placeholder="subdirectory" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="site-name">Description</Label>
              <Textarea placeholder="Small Description for your site" />
            </div>
          </div>
        </CardContent>

        <CardFooter className="mt-6 justify-end gap-3">
          <Link
            href="/dashboard/sites"
            className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
          >
            <span>Cancel</span>
          </Link>

          <button type="submit" className={cn(buttonVariants(), "gap-2")}>
            <span>Submit</span>
            <SendHorizontal className="size-4" />
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
