"use client";

import { useActionState, useEffect, useState } from "react";
import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4";
import { SendHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ImageUploadField } from "@/components/image-upload-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PendingSubmitButton } from "@/components/pending-submit-button";
import { Textarea } from "@/components/ui/textarea";
import { siteSchema } from "@/lib/zodSchema";
import { createSiteAction } from "./actions";

export function CreateSiteForm() {
  const [lastResult, action] = useActionState(createSiteAction, undefined);
  const [imageUrl, setImageUrl] = useState("/site-wireframe.svg");
  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(siteSchema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: siteSchema });
    },
  });

  useEffect(() => {
    if (lastResult?.status !== "error") {
      return;
    }

    toast.error("Unable to create site", {
      description: "Please fix the highlighted fields and try again.",
    });
  }, [lastResult]);

  return (
    <Card className="w-full [--card-spacing:--spacing(4)] sm:[--card-spacing:--spacing(6)]">
      <form {...getFormProps(form)} action={action}>
        <CardContent>
          <div className="grid gap-6">
            <FieldError errors={form.errors} />
            <input type="hidden" name={fields.imageUrl.name} value={imageUrl} />

            <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
              <div className="grid gap-2.5">
                <Label htmlFor={fields.name.id}>Site Name</Label>
                <Input
                  {...getInputProps(fields.name, { type: "text" })}
                  className="h-11"
                  placeholder="My awesome blog"
                />
                <FieldError errors={fields.name.errors} />
              </div>

              <div className="grid gap-2.5">
                <Label htmlFor={fields.subdirectory.id}>Subdirectory</Label>
                <Input
                  {...getInputProps(fields.subdirectory, { type: "text" })}
                  className="h-11"
                  placeholder="my-awesome-blog"
                />
                <FieldError errors={fields.subdirectory.errors} />
              </div>
            </div>

            <div className="grid gap-2.5">
              <ImageUploadField
                label="Site Image"
                value={imageUrl}
                onChange={setImageUrl}
                helperText="Add a polished cover for this site. The wireframe preview stays in place until a real image is uploaded."
                successDescription="Site image is ready."
              />
              <FieldError errors={fields.imageUrl.errors} />
            </div>

            <div className="grid gap-2.5">
              <Label htmlFor={fields.description.id}>Description</Label>
              <Textarea
                {...getTextareaProps(fields.description)}
                className="min-h-32 resize-none"
                placeholder="Small description for your site"
              />
              <FieldError errors={fields.description.errors} />
            </div>
          </div>
        </CardContent>

        <CardFooter className="mt-4 justify-end gap-3">
          <PendingSubmitButton
            className="w-full sm:w-auto"
            pendingText="Creating site..."
            icon={<SendHorizontal className="size-4" />}
          >
            Create Site
          </PendingSubmitButton>
        </CardFooter>
      </form>
    </Card>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return (
    <p className="text-sm font-medium text-destructive" role="alert">
      {errors[0]}
    </p>
  );
}
