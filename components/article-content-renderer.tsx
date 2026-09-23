import type { ReactNode } from "react";

type ArticleNode = {
  attrs?: Record<string, unknown>;
  content?: ArticleNode[];
  marks?: Array<{ type: string }>;
  text?: string;
  type?: string;
};

type ArticleContentRendererProps = {
  content: unknown;
};

export function ArticleContentRenderer({ content }: ArticleContentRendererProps) {
  const node = isArticleNode(content) ? content : null;

  if (!node?.content?.length) {
    return (
      <p className="text-sm text-muted-foreground">
        This article does not have content yet.
      </p>
    );
  }

  return (
    <div className="article-content space-y-5">
      {node.content.map((child, index) => renderNode(child, index))}
    </div>
  );
}

function renderNode(node: ArticleNode, index: number): ReactNode {
  const children = node.content?.map((child, childIndex) =>
    renderNode(child, childIndex),
  );

  if (node.type === "text") {
    return renderText(node, index);
  }

  switch (node.type) {
    case "heading": {
      const level = Number(node.attrs?.level ?? 1);
      const className =
        level === 1
          ? "text-3xl font-bold tracking-tight"
          : "text-2xl font-semibold tracking-tight";

      return level === 1 ? (
        <h1 key={index} className={className}>
          {children}
        </h1>
      ) : (
        <h2 key={index} className={className}>
          {children}
        </h2>
      );
    }
    case "paragraph":
      return (
        <p key={index} className="leading-8 text-muted-foreground">
          {children}
        </p>
      );
    case "bulletList":
      return (
        <ul key={index} className="list-disc space-y-2 pl-6">
          {children}
        </ul>
      );
    case "orderedList":
      return (
        <ol key={index} className="list-decimal space-y-2 pl-6">
          {children}
        </ol>
      );
    case "listItem":
      return (
        <li key={index} className="leading-7">
          {children}
        </li>
      );
    case "blockquote":
      return (
        <blockquote
          key={index}
          className="border-l-4 border-primary pl-4 text-muted-foreground"
        >
          {children}
        </blockquote>
      );
    case "codeBlock":
      return (
        <pre
          key={index}
          className="overflow-x-auto rounded-lg bg-muted p-4 text-sm leading-7"
        >
          <code>{getText(node)}</code>
        </pre>
      );
    default:
      return <div key={index}>{children}</div>;
  }
}

function renderText(node: ArticleNode, index: number): ReactNode {
  let content: ReactNode = node.text ?? "";

  node.marks?.forEach((mark) => {
    if (mark.type === "bold") {
      content = <strong>{content}</strong>;
    }

    if (mark.type === "italic") {
      content = <em>{content}</em>;
    }

    if (mark.type === "code") {
      content = (
        <code className="rounded bg-muted px-1 py-0.5 text-sm">{content}</code>
      );
    }
  });

  return <span key={index}>{content}</span>;
}

function getText(node: ArticleNode): string {
  const ownText = node.text ?? "";
  const childText = node.content?.map(getText).join("") ?? "";

  return `${ownText}${childText}`;
}

function isArticleNode(value: unknown): value is ArticleNode {
  return typeof value === "object" && value !== null;
}
