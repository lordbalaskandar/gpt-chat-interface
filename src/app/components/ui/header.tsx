import { Box, Paper, Typography, Avatar } from "@mui/material";
import { SmartToy } from "@mui/icons-material";

export default function Header() {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 2,
        background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
        color: "white",
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
          <SmartToy />
        </Avatar>
        <Box>
          <Typography variant="h6">LLM Calls: </Typography>
          <Typography variant="h6">API Calls: </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
