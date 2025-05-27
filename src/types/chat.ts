

export interface Message {
  role: string;
  content: string;
}

export interface ChatHistoryRequest {
  chat_history: Message[];
}


