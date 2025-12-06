import { Box, CircularProgress } from "@mui/material";

function LoadingSpinner({ fullScreen = false }) {
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				width: fullScreen ? "100vw" : "100%",
				height: fullScreen ? "100vh" : "100%",
				position: fullScreen ? "fixed" : "relative",
				top: 0,
				left: 0,
				zIndex: 2000,
				bgcolor: fullScreen ? "background.default" : "transparent",
			}}
		>
			<CircularProgress size={40} />
		</Box>
	);
}

export default LoadingSpinner;
