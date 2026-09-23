"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { JSONContent } from "@tiptap/react";
import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4";
import { RefreshCcwIcon, SaveIcon } from "lucide-react";
import slugify from "slugify";
import { toast } from "sonner";
import { ImageUploadField } from "@/components/image-upload-field";
import { PendingSubmitButton } from "@/components/pending-submit-button";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { articleSchema } from "@/lib/zodSchema";
import { updateArticleAction } from "./actions";

type EditArticleFormProps = {
  article: {
    articleContent: JSONContent;
    image: string;
    slug: string;
    smallDescription: string;
    title: string;
  };
  postId: string;
  siteId: string;
};

export function EditArticleForm({
  article,
  postId,
  siteId,
}: EditArticleFormProps) {
  const action = updateArticleAction.bind(null, siteId, postId);
  const [lastResult, formAction] = useActionState(action, undefined);
  const titleRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(article.image);
  const [articleContent, setArticleContent] = useState(() =>
    JSON.stringify(article.articleContent),
  );
  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(articleSchema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: articleSchema });
    },
  });

  useEffect(() => {
    if (lastResult?.status !== "error") {
      return;
    }

    toast.error("Unable to update article", {
      description: "Please fix the highlighted fields and try again.",
    });
  }, [lastResult]);

  function generateSlug() {
    if (!slugRef.current) {
      return;
    }

    const nextSlug = slugify(titleRef.current?.value ?? "", {
      lower: true,
      strict: true,
      trim: true,
    });

    if (!nextSlug) {
      toast.error("Add a title first", {
        description: "Write the article title, then generate the slug.",
      });
      return;
    }

    slugRef.current.value = nextSlug;
    slugRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    toast.success("Slug generated", {
      description: nextSlug,
    });
  }

  return (
    <Card className="w-full [--card-spacing:--spacing(4)] sm:[--card-spacing:--spacing(6)]">
      <form {...getFormProps(form)} action={formAction}>
        <CardContent>
          <div className="grid gap-6">
            <FieldError errors={form.errors} />
            <input type="hidden" name={fields.image.name} value={imageUrl} />
            <input
              type="hidden"
              name={fields.articleContent.name}
              value={articleContent}
            />

            <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
              <div className="grid gap-2.5">
                <Label htmlFor={fields.title.id}>Title</Label>
                <Input
                  {...getInputProps(fields.title, { type: "text" })}
                  ref={titleRef}
                  className="h-11"
                  defaultValue={article.title}
                  placeholder="How to build a focused writing habit"
                />
                <FieldError errors={fields.title.errors} />
              </div>

              <div className="grid gap-2.5">
                <Label htmlFor={fields.slug.id}>Slug</Label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    {...getInputProps(fields.slug, { type: "text" })}
                    ref={slugRef}
                    className="h-11"
                    defaultValue={article.slug}
                    placeholder="focused-writing-habit"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 shrink-0 cursor-pointer gap-2 px-4"
                    onClick={generateSlug}
                  >
                    <RefreshCcwIcon className="size-4" />
                    Generate slug
                  </Button>
                </div>
                <FieldError errors={fields.slug.errors} />
              </div>
            </div>

            <div className="grid gap-2.5">
              <ImageUploadField
                label="Article Image"
                value={imageUrl}
                onChange={setImageUrl}
                helperText="Choose a strong cover image for the article card and preview pages."
                successDescription="Article image is ready."
              />
              <FieldError errors={fields.image.errors} />
            </div>

            <div className="grid gap-2.5">
              <Label htmlFor={fields.smallDescription.id}>
                Small Description
              </Label>
              <Textarea
                {...getTextareaProps(fields.smallDescription)}
                className="min-h-28 resize-none"
                defaultValue={article.smallDescription}
                placeholder="A short summary shown on cards and previews."
              />
              <FieldError errors={fields.smallDescription.errors} />
            </div>

            <div className="grid gap-2.5">
              <Label htmlFor={fields.articleContent.id}>Article Content</Label>
              <RichTextEditor
                initialContent={article.articleContent}
                onChange={(content) => {
                  setArticleContent(JSON.stringify(content));
                }}
              />
              <FieldError errors={fields.articleContent.errors} />
            </div>
          </div>
        </CardContent>

        <CardFooter className="mt-4 justify-end gap-3">
          <PendingSubmitButton
            className="w-full sm:w-auto"
            pendingText="Saving article..."
            icon={<SaveIcon className="size-4" />}
          >
            Save Article
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
