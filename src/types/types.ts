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

export interface Message {
  role: string;
  content: string;
}

export interface ChatHistoryRequest {
  chat_history: Message[];
}

export interface LLMResponse {
  user: Message;
  assistant: Message;
}

export interface LLMResponseWithContext extends LLMResponse {
  context: string;
}
