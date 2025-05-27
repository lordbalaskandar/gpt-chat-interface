import { Send } from "@mui/icons-material";
import { Box, Chip, IconButton, TextField } from "@mui/material";
import { theme } from "../styles";
import { Message } from "@/types/chat";

export default function TypingArea({
  inputRef,
  inputText,
  setInputText,
  handleKeyPress,
  handleSendMessage,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputText: Message["content"];
  setInputText: React.Dispatch<React.SetStateAction<Message["content"]>>;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSendMessage: () => Promise<void>;
}) {
  return (
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
          <Send />
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
  );
}
