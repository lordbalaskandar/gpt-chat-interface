import { Document } from "@/types/llm";

export function matchDocumentId(
  message: string,
  documents: Document[]
): string | null {
  const lowerMessage = message.toLowerCase();
  for (const doc of documents) {
    if (lowerMessage.includes(doc.title.toLowerCase())) {
      return doc.id;
    }
  }
  return null;
}

export function looksLikeDocQuery(message: string): boolean {
  const lower = message.toLowerCase();

  const docKeywords = [
    "handbook",
    "policy",
    "manual",
    "guide",
    "report",
    "whitepaper",
    "guidelines",
    "terms",
    "conditions",
    "document",
    "compliance",
  ];

  const actionKeywords = [
    "find",
    "locate",
    "summarize",
    "explain",
    "mention",
    "refer to",
    "included",
    "show",
    "contained",
  ];

  const docPhrases = [
    /according to the [\w\s]+/,
    /in the [\w\s]+/,
    /based on the [\w\s]+/,
    /refer to (the )?[\w\s]+/,
    /contained in (the )?[\w\s]+/,
  ];

  // Match keywords
  const hasDocKeyword = docKeywords.some((k) => lower.includes(k));
  const hasActionKeyword = actionKeywords.some((k) => lower.includes(k));
  const hasDocPhrase = docPhrases.some((rx) => rx.test(lower));

  // Heuristic: if it has doc + action, or matches phrase, we assume it's doc-related
  return (hasDocKeyword && hasActionKeyword) || hasDocPhrase;
}

export function determineNumChunks(userMessage: string, chatHistoryLength: number = 0): number {
  const baseMaxTokens = 2000;
  const avgTokensPerChunk = 200;
  const reservedTokens = 500 + chatHistoryLength * 50;

  const availableTokensForChunks = baseMaxTokens - reservedTokens;
  const maxPossibleChunks = Math.floor(availableTokensForChunks / avgTokensPerChunk);

  const lower = userMessage.toLowerCase();

  // Simple heuristics
  if (lower.length < 40) return Math.min(maxPossibleChunks, 3); // very short query
  if (lower.includes("summary") || lower.includes("summarize")) return Math.min(maxPossibleChunks, 8);
  if (lower.includes("compare") || lower.includes("difference") || lower.includes("advantages")) return Math.min(maxPossibleChunks, 7);
  if (lower.includes("everything") || lower.includes("all of")) return Math.min(maxPossibleChunks, 10);

  // Default
  return Math.min(maxPossibleChunks, 5);
}

