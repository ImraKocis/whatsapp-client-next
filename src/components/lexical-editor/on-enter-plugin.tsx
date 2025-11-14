import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_HIGH, KEY_ENTER_COMMAND } from "lexical";
import { useEffect } from "react";

interface OnEnterPluginProps {
  onEnter: () => void;
}

export function OnEnterPlugin({ onEnter }: OnEnterPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event: KeyboardEvent) => {
        // Only send if Enter is pressed without Shift
        if (event.shiftKey) {
          return false; // Allow new line
        }

        event.preventDefault();
        onEnter();
        return true;
      },
      COMMAND_PRIORITY_HIGH,
    );
  }, [editor, onEnter]);

  return null;
}
