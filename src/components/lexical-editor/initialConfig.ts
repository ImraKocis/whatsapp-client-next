import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import theme from "@/components/lexical-editor/theme";

export const initialConfig: InitialConfigType = {
  namespace: "ChatEditor",
  theme: theme,
  onError(error: Error) {
    console.error("Lexical Error:", error);
  },
};
