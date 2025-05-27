import { ChatHistoryRequest, Message } from "./chat";

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

export interface Document {
  id: string;
  title: string;
  url: string;
}

export interface SemanticResult {
  chunk: string;
  title: string;
  url: string;
}

export interface LLMResponse {
  user: Message;
  assistant: Message;
}

export interface LLMResponseWithContext extends LLMResponse {
  context: string;
}