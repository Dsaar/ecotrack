// src/features/dashboard/components/ProfileStatsCard.jsx
import {
	Box,
	Card,
	CardContent,
	Stack,
	Typography,
} from "@mui/material";

function ProfileStatsCard({ ecoPoints, activeMissions, submissionsCount }) {
	return (
		<Card sx={{ borderRadius: 4 }}>
			<CardContent>
				<Typography variant="h6" sx={{ mb: 2 }}>
					Mission stats
				</Typography>

				<Stack
					direction={{ xs: "column", sm: "row" }}
					spacing={4}
					sx={{ mb: 2 }}
				>
					<Box>
						<Typography variant="h5" sx={{ fontWeight: 600, color: "#166534" }}>
							{ecoPoints}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Eco points
						</Typography>
					</Box>

					<Box>
						<Typography variant="h5" sx={{ fontWeight: 600 }}>
							{activeMissions}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Active missions
						</Typography>
					</Box>

					<Box>
						<Typography variant="h5" sx={{ fontWeight: 600 }}>
							{submissionsCount}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Submissions
						</Typography>
					</Box>
				</Stack>

				<Typography variant="body2" color="text.secondary">
					As you complete missions, your points and impact stats will grow
					here. Later we can show detailed CO₂, water and waste savings
					aggregated from your submissions.
				</Typography>
			</CardContent>
		</Card>
	);
}

export default ProfileStatsCard;
