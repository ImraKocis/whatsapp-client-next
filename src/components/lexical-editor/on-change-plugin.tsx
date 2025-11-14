import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

interface OnChangePluginProps {
  onChange: (isEmpty: boolean) => void;
}

export function OnChangePlugin({ onChange }: OnChangePluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const textContent = editor.getEditorState().read(() => {
          return editor.getRootElement()?.textContent || "";
        });

        const isEmpty = textContent.trim().length === 0;
        onChange(isEmpty);
      });
    });
  }, [editor, onChange]);

  return null;
}
