"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatWindow from "./components/ui/messages/chat-window";

const queryClient = new QueryClient();


// Main component with QueryClient provider
const Page = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatWindow />
    </QueryClientProvider>
  );
};

export default Page;
