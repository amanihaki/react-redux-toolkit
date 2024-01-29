import { CircularProgress, Box } from "@mui/material";
function Loading() {
  return (
    <Box textAlign="center" my={12}>
      <CircularProgress size={47} color="primary" />
    </Box>
  );
}

export default Loading;
