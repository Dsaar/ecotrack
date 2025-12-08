// src/features/dashboard/components/MissionDescriptionCard.jsx
import { Box, Card, CardContent, Typography } from "@mui/material";

function MissionDescriptionCard({ description }) {
	return (
		<Card
			elevation={0}
			sx={{
				flex: 2,
				borderRadius: 3,
				border: "1px solid",
				borderColor: "divider",
				bgcolor: "background.paper",
			}}
		>
			<CardContent
				sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
			>
				{/* Placeholder for future mission image */}
				<Box
					sx={{
						mb: 1,
						width: "100%",
						borderRadius: 2,
						bgcolor: "action.hover",
						minHeight: 120,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "text.secondary",
						fontSize: 14,
					}}
				>
					Mission visual will go here
				</Box>

				<Typography variant="h6" sx={{ fontWeight: 600 }}>
					What you’ll do
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ whiteSpace: "pre-line" }}
				>
					{description || "No description provided for this mission yet."}
				</Typography>
			</CardContent>
		</Card>
	);
}

export default MissionDescriptionCard;
