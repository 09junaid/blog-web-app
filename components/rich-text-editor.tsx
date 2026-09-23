"use client";

import type { ReactNode } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  BoldIcon,
  Code2Icon,
  Heading1Icon,
  Heading2Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  PilcrowIcon,
  QuoteIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  className?: string;
  initialContent: JSONContent;
  onChange: (content: JSONContent) => void;
};

export function RichTextEditor({
  className,
  initialContent,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your article content here...",
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "min-h-[260px] bg-card px-4 py-4 leading-7 outline-none sm:min-h-[360px] sm:px-5",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getJSON());
    },
  });

  return (
    <div
      className={cn(
        "rich-text-editor overflow-hidden rounded-xl border bg-card shadow-sm",
        "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/40",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/30 p-2">
        <ToolbarButton
          isActive={editor?.isActive("paragraph")}
          label="Paragraph"
          onClick={() => editor?.chain().focus().setParagraph().run()}
        >
          <PilcrowIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          isActive={editor?.isActive("heading", { level: 1 })}
          label="Heading 1"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1Icon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          isActive={editor?.isActive("heading", { level: 2 })}
          label="Heading 2"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2Icon className="size-4" />
        </ToolbarButton>
        <ToolbarSeparator />
        <ToolbarButton
          isActive={editor?.isActive("bold")}
          label="Bold"
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <BoldIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          isActive={editor?.isActive("italic")}
          label="Italic"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon className="size-4" />
        </ToolbarButton>
        <ToolbarSeparator />
        <ToolbarButton
          isActive={editor?.isActive("bulletList")}
          label="Bullet list"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <ListIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          isActive={editor?.isActive("orderedList")}
          label="Numbered list"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrderedIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          isActive={editor?.isActive("blockquote")}
          label="Quote"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <QuoteIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          isActive={editor?.isActive("codeBlock")}
          label="Code block"
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        >
          <Code2Icon className="size-4" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  children,
  isActive,
  label,
  onClick,
}: {
  children: ReactNode;
  isActive?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant={isActive ? "secondary" : "ghost"}
      size="icon-sm"
      aria-label={label}
      title={label}
      className={cn(
        "cursor-pointer",
        isActive &&
          "bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground",
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function ToolbarSeparator() {
  return <span className="mx-1 h-5 w-px bg-border" />;
}
