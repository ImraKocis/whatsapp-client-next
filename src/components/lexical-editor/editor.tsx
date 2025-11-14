"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { $getRoot } from "lexical";
import { Send } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import type { MessageInputProps } from "@/components/chat/message-inpit";
import { OnChangePlugin } from "@/components/lexical-editor/on-change-plugin";
import { OnEnterPlugin } from "@/components/lexical-editor/on-enter-plugin";
import { Button } from "@/components/ui/button";

export function EditorContent({
  onSend,
  onTypingStart,
  onTypingStop,
  disabled,
}: MessageInputProps) {
  const [editor] = useLexicalComposerContext();
  const [isEmpty, setIsEmpty] = useState(true);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = useCallback(
    (empty: boolean) => {
      setIsEmpty(empty);

      if (!empty) {
        onTypingStart();

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          onTypingStop();
        }, 2000);
      } else {
        onTypingStop();
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    },
    [onTypingStart, onTypingStop],
  );

  const handleSend = useCallback(() => {
    if (isEmpty || disabled) return;

    editor.update(() => {
      const root = $getRoot();
      const textContent = root.getTextContent().trim();

      if (textContent) {
        const editorState = editor.getEditorState();
        const editorStateJSON = editorState.toJSON();
        const jsonString = JSON.stringify(editorStateJSON);

        onSend(jsonString);

        root.clear();
        setIsEmpty(true);

        onTypingStop();
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    });
  }, [editor, isEmpty, disabled, onSend, onTypingStop]);

  return (
    <>
      <OnChangePlugin onChange={handleChange} />
      <OnEnterPlugin onEnter={handleSend} />

      <div className="border-t p-4">
        <div className="flex gap-2 items-center">
          <div className="flex-1 min-h-[35px] max-h-[120px] overflow-y-auto border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-ring relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="outline-none min-h-[24px] text-sm"
                  style={{ caretColor: "auto" }}
                />
              }
              placeholder={
                <div className="absolute top-2 left-3 text-gray-400 pointer-events-none text-sm">
                  Type a message...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>

          <Button
            onClick={handleSend}
            disabled={disabled || isEmpty}
            size="icon"
            className="p-5"
          >
            <Send className="min-h-4 min-w-4" />
          </Button>
        </div>
      </div>
      <HistoryPlugin />
    </>
  );
}
