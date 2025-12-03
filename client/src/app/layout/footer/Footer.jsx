// src/app/layout/footer/Footer.jsx
import { Box, Typography } from "@mui/material";

function Footer() {
	return (
		<Box
			component="footer"
			sx={{
				borderTop: "1px solid #e5e7eb",
				bgcolor: "white",
				py: 2,
				mt: "auto",
				textAlign: "center",
			}}
		>
			<Typography variant="body2" color="text.secondary">
				© {new Date().getFullYear()} EcoTrack. All rights reserved.
			</Typography>
		</Box>
	);
}

export default Footer;
