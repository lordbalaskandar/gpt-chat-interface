import { ChatHistoryRequest } from "./types";

export interface SemanticQueryParams {
  query: string;
  nChunks?: number;
  documentIds?: number[];
}

export interface LLMContextualSearchVariables {
  query: string;
  chatHistory?: ChatHistoryRequest['chat_history'];
  documentIds?: number[];
  nChunks?: number;
  developMode?: boolean;
}

export interface LLMRegularQuestionVariables {
  query: string;
  chatHistory?: ChatHistoryRequest['chat_history'];
  developMode?: boolean;
}

export interface CallsLeftResponse {
  calls_left: number;
}