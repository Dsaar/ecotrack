// src/app/layout/main/Main.jsx
import { Box, Container } from "@mui/material";

function Main({ children }) {
	return (
		<Box
			component="main"
			sx={{
				flexGrow: 1,
				py: { xs: 4, md: 6 },
			}}
		>
			<Container maxWidth="lg">{children}</Container>
		</Box>
	);
}

export default Main;
