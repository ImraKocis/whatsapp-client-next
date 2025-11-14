"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { EditorContent } from "@/components/lexical-editor/editor";
import { initialConfig } from "@/components/lexical-editor/initialConfig";

export interface MessageInputProps {
  onSend: (content: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  disabled?: boolean;
}

export const MessageInput = (props: MessageInputProps) => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorContent {...props} />
    </LexicalComposer>
  );
};
