export function extractTextFromLexical(jsonString: string): string {
  try {
    const editorState = JSON.parse(jsonString);

    if (editorState?.root?.children) {
      let text: string;

      const extractFromNode = (node: any): string => {
        if (node.type === "text") {
          return node.text || "";
        }

        if (node.children && Array.isArray(node.children)) {
          return node.children.map(extractFromNode).join("");
        }

        return "";
      };

      text = editorState.root.children.map(extractFromNode).join(" ");
      return text.trim();
    }

    return "";
  } catch (error) {
    console.error("Failed to extract text from Lexical JSON:", error);
    return jsonString;
  }
}
