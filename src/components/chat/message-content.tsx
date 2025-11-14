"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { extractTextFromLexical } from "@/lib/lexical/helpers";

interface MessageContentProps {
  content: string;
  plainText: string;
}

const viewerConfig = {
  namespace: "MessageViewer",
  theme: {
    paragraph: "mb-1",
    text: {
      bold: "font-bold",
      italic: "italic",
      underline: "underline",
    },
  },
  editable: false,
  onError(error: Error) {
    console.error("Lexical Viewer Error:", error);
  },
};

function MessageViewer({ content, plainText }: Readonly<MessageContentProps>) {
  const [editor] = useLexicalComposerContext();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const editorStateJSON = JSON.parse(content);
      const editorState = editor.parseEditorState(editorStateJSON);
      editor.setEditorState(editorState);
      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to parse message content:", error);
      editor.update(() => {
        const root = editor.getRootElement();
        if (root) {
          root.textContent = content;
        }
      });
      setIsLoaded(true);
    }
  }, [editor, content]);

  if (!isLoaded) {
    return (
      <div className="space-y-1">
        <Skeleton className="h-4 w-fit">
          <p className="text-transparent">{plainText}</p>
        </Skeleton>
      </div>
    );
  }

  return (
    <RichTextPlugin
      contentEditable={
        <ContentEditable className="outline-none cursor-default text-sm" />
      }
      placeholder={null}
      ErrorBoundary={LexicalErrorBoundary}
    />
  );
}

export const MessageContent = ({ content }: MessageContentProps) => {
  const plainText = useMemo(() => extractTextFromLexical(content), [content]);
  return (
    <LexicalComposer initialConfig={viewerConfig}>
      <MessageViewer content={content} plainText={plainText} />
    </LexicalComposer>
  );
};
