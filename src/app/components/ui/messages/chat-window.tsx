"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Box, Paper, Container } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Message } from "@/types/chat";

import {
  useGetAllDocumentInfo,
  useLLMContextualSearch,
  useLLMRegularQuestion,
} from "../../hooks/useLLM";
import {
  matchDocumentId,
  looksLikeDocQuery,
  determineNumChunks,
} from "../../utils/document-matcher";
import Header from "../header";
import { theme } from "../styles";
import TypingArea from "./input-area";
import MessageBubble from "./message-bubble";
import TypingIndicator from "./typing-indicator";

export default function ChatWindow() {
  const { data: documents = [] } = useGetAllDocumentInfo();

  const { mutateAsync: contextualSearch } = useLLMContextualSearch();

  const { mutateAsync: regularQuestion } = useLLMRegularQuestion();

  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! How can I help you today?",
      role: "system",
    },
  ]);
  const [inputText, setInputText] = useState<Message["content"]>("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const useHeader = useMemo(() => {
    return <Header online={documents.length > 0} />;
  }, [documents]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = { role: "user", content: inputText };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);

    const docId = matchDocumentId(inputText, documents);
    const isDocRelated = looksLikeDocQuery(inputText);
    const nChunks = determineNumChunks(inputText);
    try {
      setIsTyping(true);
      if (docId || isDocRelated) {
        const response = await contextualSearch({
          query: inputText,
          chatHistory: updatedHistory,
          documentIds: docId ? [Number(docId)] : undefined,
          nChunks,
        });
        setMessages((prev) => [...prev, response.assistant]);
      } else {
        const response = await regularQuestion({
          query: inputText,
          chatHistory: updatedHistory,
        });
        setMessages((prev) => [...prev, response.assistant]);
      }
    } catch (err) {
      setIsTyping(false);
      console.error("Message routing failed", err);
    } finally {
      setInputText("");
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="md"
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          py: 2,
        }}
      >
        {useHeader}

        {/* Messages Container */}
        <Paper
          elevation={2}
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            backgroundColor: "#fafafa",
          }}
        >
          {/* Messages Area */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: "auto",
              p: 2,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#c1c1c1",
                borderRadius: "3px",
                "&:hover": {
                  background: "#a8a8a8",
                },
              },
            }}
          >
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}

            {/* Typing Indicator */}
            <TypingIndicator isTyping={isTyping} />
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <TypingArea
            inputRef={inputRef}
            inputText={inputText}
            setInputText={setInputText}
            handleKeyPress={handleKeyPress}
            handleSendMessage={handleSendMessage}
          />
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
