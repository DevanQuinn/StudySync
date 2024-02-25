import Box from "@mui/material/Box";
const Pomodoro = () => {
  return (
    <Box display={"flex"} flexDirection={"column"} justifyContent={"center"}>
      <Box>Focus</Box>
      <Box fontSize={"256px"}>05:00</Box>
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"center"}
        gap={"20px"}
      >
      </Box>
    </Box>
  );
};

export default Pomodoro;