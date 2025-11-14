import { extractTextFromLexical } from "@/lib/lexical/helpers";

export const useContactListItem = () => {
  const formatTimestamp = (timestamp: string): string => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 24 && now.getDate() === messageDate.getDate()) {
      return messageDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    if (diffInHours < 7 * 24) {
      return messageDate.toLocaleDateString("en-US", { weekday: "long" });
    }

    return messageDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const truncateMessage = (message: string, maxLength: number = 35): string => {
    const plainText = extractTextFromLexical(message);

    if (plainText.length <= maxLength) return plainText;
    return `${plainText.slice(0, maxLength)}...`;
  };

  return {
    formatTimestamp,
    getInitials,
    truncateMessage,
  };
};
