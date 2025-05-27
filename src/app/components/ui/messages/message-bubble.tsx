import { Message } from "@/types/chat";
import { Avatar, Box, Paper, Typography } from "@mui/material";
import {
  Person,
  SmartToy,
} from "@mui/icons-material";
import { theme } from "../styles";

export default function MessageBubble({message}: {message: Message}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: message.role === "user" ? "flex-end" : "flex-start",
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
          flexDirection: message.role === "user" ? "row-reverse" : "row",
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: message.role === "user" ? "#1976d2" : "#ff9800",
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.1)" },
          }}
        >
          {message.role === "user" ? (
            <Person fontSize="small" />
          ) : (
            <SmartToy fontSize="small" />
          )}
        </Avatar>
        <Paper
          elevation={1}
          sx={{
            p: 2,
            backgroundColor: message.role === "user" ? "#1976d2" : "white",
            color: message.role === "user" ? "white" : "text.primary",
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
  );
}
