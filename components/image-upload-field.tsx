"use client";

import Image from "next/image";
import { useState } from "react";
import { UploadCloudIcon } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

type ImageUploadFieldProps = {
  helperText: string;
  label: string;
  onChange: (url: string) => void;
  successDescription: string;
  value: string;
};

const placeholderImage = "/site-wireframe.svg";

export function ImageUploadField({
  helperText,
  label,
  onChange,
  successDescription,
  value,
}: ImageUploadFieldProps) {
  const hasUploadedImage = value !== placeholderImage;
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const displayProgress = Math.min(Math.max(Math.round(uploadProgress), 0), 100);

  return (
    <div className="grid gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <Label>{label}</Label>
        <span className="rounded-md border bg-muted/40 px-2 py-1 text-[11px] font-medium text-muted-foreground">
          4MB max
        </span>
      </div>

      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-dotted shadow-sm",
          "border-border bg-card transition-colors hover:border-primary/60",
          isUploading && "border-primary/70"
        )}
      >
        {hasUploadedImage && (
          <>
            <Image
              src={value}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 900px, 100vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px]" />
          </>
        )}

        <UploadDropzone
          endpoint="imageUploader"
          uploadProgressGranularity="fine"
          className={cn(
            "relative z-10 min-h-[220px] w-full cursor-pointer border-none sm:min-h-[300px]",
            "bg-transparent px-6 py-10 transition-colors",
            "ut-uploading:cursor-wait"
          )}
          appearance={{
            allowedContent:
              "mt-2 text-sm font-medium text-muted-foreground",
            button:
              "mt-6 h-12 rounded-lg bg-primary px-5 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/80",
            container:
              "m-0 flex min-h-[220px] w-full flex-col items-center justify-center border-none bg-transparent p-0 sm:min-h-[300px]",
            label:
              "mt-5 text-center text-lg font-semibold text-primary",
            uploadIcon: "size-14 text-muted-foreground",
          }}
          content={{
            allowedContent: "Image (4MB)",
            button({ files, isUploading }) {
              if (isUploading) {
                return "Uploading...";
              }

              if (files.length) {
                return `Upload ${files.length} file`;
              }

              return hasUploadedImage ? "Change image" : "Upload image";
            },
            label: hasUploadedImage
              ? "Drop a new image or click to change"
              : "Choose files or drag and drop",
            uploadIcon: <UploadCloudIcon className="size-14" />,
          }}
          onUploadBegin={() => {
            setIsUploading(true);
            setUploadProgress(0);
          }}
          onUploadProgress={(progress) => {
            setUploadProgress(progress);
          }}
          onClientUploadComplete={(res) => {
            const url = res[0]?.ufsUrl;

            if (!url) {
              return;
            }

            onChange(url);
            setUploadProgress(100);
            setIsUploading(false);
            toast.success("Image uploaded", {
              description: successDescription,
            });
          }}
          onUploadError={(error: Error) => {
            setIsUploading(false);
            toast.error("Upload failed", {
              description: error.message,
            });
          }}
        />

        {(isUploading || displayProgress > 0) && (
          <div className="relative z-10 mx-5 mb-5 space-y-2 rounded-lg border bg-background/90 p-3 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-muted-foreground">
                {displayProgress === 100 ? "Upload complete" : "Uploading image"}
              </span>
              <span className="tabular-nums text-foreground">
                {displayProgress}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <p className="text-xs leading-5 text-muted-foreground">{helperText}</p>
    </div>
  );
}
