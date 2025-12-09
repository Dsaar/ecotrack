// src/features/dashboard/components/CommunityStatsStrip.jsx
import { Card, CardContent, Grid, Typography, Box } from "@mui/material";

function StatItem({ label, value, suffix }) {
	return (
		<Box>
			<Typography
				variant="subtitle2"
				color="text.secondary"
				sx={{ textTransform: "uppercase", fontSize: 11, mb: 0.5 }}
			>
				{label}
			</Typography>
			<Typography variant="h6" sx={{ fontWeight: 600 }}>
				{value.toLocaleString()}
				{suffix ? ` ${suffix}` : ""}
			</Typography>
		</Box>
	);
}

function CommunityStatsStrip({ stats }) {
	const {
		membersCount,
		totalEcoPoints,
		totalMissionsCompleted,
		co2SavedKg,
		waterSavedL,
		wasteDivertedKg,
	} = stats;

	return (
		<Card sx={{ borderRadius: 4 }}>
			<CardContent>
				<Grid container spacing={3}>
					<Grid item xs={6} md={2.4}>
						<StatItem label="Members" value={membersCount} />
					</Grid>
					<Grid item xs={6} md={2.4}>
						<StatItem label="Total eco points" value={totalEcoPoints} />
					</Grid>
					<Grid item xs={6} md={2.4}>
						<StatItem
							label="Missions completed"
							value={totalMissionsCompleted}
						/>
					</Grid>
					<Grid item xs={6} md={2.4}>
						<StatItem label="CO₂ saved" value={co2SavedKg} suffix="kg" />
					</Grid>
					<Grid item xs={6} md={2.4}>
						<StatItem label="Water saved" value={waterSavedL} suffix="L" />
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
}

export default CommunityStatsStrip;
