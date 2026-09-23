import { z } from "zod";

type NovelNode = {
  content?: NovelNode[];
  text?: string;
  type?: string;
};

function parseArticleContent(value: string) {
  try {
    return JSON.parse(value) as NovelNode;
  } catch {
    return null;
  }
}

function getNovelText(node: NovelNode): string {
  const ownText = typeof node.text === "string" ? node.text : "";
  const childText = node.content?.map(getNovelText).join(" ") ?? "";

  return `${ownText} ${childText}`.trim();
}

export const siteSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Site name is required")
    .max(35, "Site name must be 35 characters or less"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(150, "Description must be 150 characters or less"),
  subdirectory: z
    .string()
    .trim()
    .min(1, "Subdirectory is required")
    .max(40, "Subdirectory must be 40 characters or less")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and single hyphens",
    ),
  imageUrl: z
    .string()
    .trim()
    .url("Upload a site image")
    .or(z.literal("/site-wireframe.svg")),
});

export const articleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(80, "Title must be 80 characters or less"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(80, "Slug must be 80 characters or less")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and single hyphens",
    ),
  smallDescription: z
    .string()
    .trim()
    .min(1, "Small description is required")
    .max(180, "Small description must be 180 characters or less"),
  articleContent: z
    .string()
    .min(1, "Article content is required")
    .refine((value) => value.length <= 100000, "Article content is too large")
    .transform((value, ctx) => {
      const content = parseArticleContent(value);

      if (!content) {
        ctx.addIssue({
          code: "custom",
          message: "Article content is invalid",
        });

        return z.NEVER;
      }

      return content;
    })
    .refine(
      (content) => getNovelText(content).length >= 20,
      "Article content must be at least 20 characters",
    ),
  image: z
    .string()
    .trim()
    .url("Upload an article image")
    .or(z.literal("/site-wireframe.svg")),
});
