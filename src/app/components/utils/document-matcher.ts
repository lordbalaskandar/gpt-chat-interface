import { Document } from "@/types/llm";

export function matchDocumentId(message: string, documents: Document[]): string | null {
  const lowerMessage = message.toLowerCase();
  for (const doc of documents) {
    if (lowerMessage.includes(doc.title.toLowerCase())) {
      return doc.id;
    }
  }
  return null;
}

export function looksLikeDocQuery(message: string): boolean {
  const keywords = ["handbook", "policy", "guide", "report", "mention", "summarize", "find in"];
  const lowerMessage = message.toLowerCase();
  return keywords.some(k => lowerMessage.includes(k));
}

export function determineNumChunks(query: string): number {
  const len = query.length;
  if (len < 50) return 3;
  if (len < 100) return 5;
  if (len < 200) return 7;
  return 10;
}