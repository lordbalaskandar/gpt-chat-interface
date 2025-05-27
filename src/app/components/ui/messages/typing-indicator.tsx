import { SmartToy } from "@mui/icons-material";
import { Avatar, Box, Paper } from "@mui/material";

export default function TypingIndicator({ isTyping }: { isTyping: boolean }) {
  return (
    <>
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
              <SmartToy fontSize="small" />
            </Avatar>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                backgroundColor: "white",
                borderRadius: "18px 18px 18px 4px",
              }}
            >
              <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
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
    </>
  );
}
