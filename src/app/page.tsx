"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Container,
} from "@mui/material";
import {
  Send as SendIcon,
  Person as PersonIcon,
  SmartToy as BotIcon,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "./components/ui/header";
import { Message } from "@/types/chat";
import {
  useGetAllDocumentInfo,
  useLLMContextualSearch,
  useLLMRegularQuestion,
} from "./components/hooks/useLLM";
import {
  matchDocumentId,
  looksLikeDocQuery,
  determineNumChunks,
} from "./components/utils/document-matcher";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create QueryClient outside component
const queryClient = new QueryClient();

// Create a modern theme
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

// Separate the chat logic into its own component
const ChatWindowInner = () => {
  const { data: documents = [] } = useGetAllDocumentInfo();

  const { mutateAsync: contextualSearch, isLoading: isContextualLoading } =
    useLLMContextualSearch();

  const { mutateAsync: regularQuestion, isLoading: isRegularLoading } =
    useLLMRegularQuestion();

  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! How can I help you today?",
      role: "system",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function you can call to add bot replies programmatically
  const addBotReply = (text: string) => {
    const botMessage = {
      content: text,
      role: "system",
    };
    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
  };

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

  const handleKeyPress = (e) => {
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
        <Header />

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
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.role === "user" ? "flex-end" : "flex-start",
                  mb: 2,
                  animation: "fadeInUp 0.3s ease-out",
                  "@keyframes fadeInUp": {
                    from: {
                      opacity: 0,
                      transform: "translateY(20px)",
                    },
                    to: {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 1,
                    maxWidth: "70%",
                    flexDirection:
                      message.role === "user" ? "row-reverse" : "row",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor:
                        message.role === "user" ? "#1976d2" : "#ff9800",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  >
                    {message.role === "user" ? (
                      <PersonIcon fontSize="small" />
                    ) : (
                      <BotIcon fontSize="small" />
                    )}
                  </Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      backgroundColor:
                        message.role === "user" ? "#1976d2" : "white",
                      color:
                        message.role === "user" ? "white" : "text.primary",
                      borderRadius:
                        message.role === "user"
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                      {message.content}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        opacity: 0.7,
                        fontSize: "0.75rem",
                      }}
                    ></Typography>
                  </Paper>
                </Box>
              </Box>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  mb: 2,
                  animation: "fadeInUp 0.3s ease-out",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: "#ff9800" }}>
                    <BotIcon fontSize="small" />
                  </Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      backgroundColor: "white",
                      borderRadius: "18px 18px 18px 4px",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", gap: 0.5, alignItems: "center" }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: "#1976d2",
                          animation: "bounce 1.4s ease-in-out infinite both",
                          "@keyframes bounce": {
                            "0%, 80%, 100%": {
                              transform: "scale(0)",
                            },
                            "40%": {
                              transform: "scale(1)",
                            },
                          },
                        }}
                      />
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: "#1976d2",
                          animation: "bounce 1.4s ease-in-out infinite both",
                          animationDelay: "-0.32s",
                        }}
                      />
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: "#1976d2",
                          animation: "bounce 1.4s ease-in-out infinite both",
                          animationDelay: "-0.16s",
                        }}
                      />
                    </Box>
                  </Paper>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #e0e0e0",
              backgroundColor: "white",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
              <TextField
                ref={inputRef}
                fullWidth
                multiline
                maxRows={4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "24px",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      "& > fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                    "&.Mui-focused": {
                      "& > fieldset": {
                        borderColor: theme.palette.primary.main,
                        borderWidth: "2px",
                      },
                    },
                  },
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                sx={{
                  bgcolor: inputText.trim() ? "primary.main" : "grey.300",
                  color: "white",
                  width: 48,
                  height: 48,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: inputText.trim() ? "primary.dark" : "grey.400",
                    transform: "scale(1.05)",
                  },
                  "&:active": {
                    transform: "scale(0.95)",
                  },
                  "&.Mui-disabled": {
                    color: "grey.500",
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
            <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
              <Chip
                label="Press Enter to send"
                size="small"
                variant="outlined"
                sx={{
                  fontSize: "0.75rem",
                  height: 24,
                  opacity: 0.7,
                  transition: "opacity 0.2s",
                  "&:hover": { opacity: 1 },
                }}
              />
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

// Main component with QueryClient provider
const ChatWindow = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatWindowInner />
    </QueryClientProvider>
  );
};

export default ChatWindow;