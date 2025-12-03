import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

function StatCard({ label, value, description }) {
	return (
		<Card
			elevation={0}
			sx={{
				borderRadius: 3,
				border: "1px solid #e5e7eb",
				bgcolor: "white",
			}}
		>
			<CardContent>
				<Typography variant="body2" color="text.secondary">
					{label}
				</Typography>
				<Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, mb: 0.5 }}>
					{value}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{description}
				</Typography>
			</CardContent>
		</Card>
	);
}

function DashboardHome() {
	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
			<Grid container spacing={2}>
				<Grid item xs={12} md={4}>
					<StatCard
						label="Missions completed"
						value="12"
						description="Total completed this month"
					/>
				</Grid>
				<Grid item xs={12} md={4}>
					<StatCard
						label="CO₂ reduced"
						value="-84 kg"
						description="Estimated impact from your missions"
					/>
				</Grid>
				<Grid item xs={12} md={4}>
					<StatCard
						label="Water saved"
						value="620 L"
						description="From home & transport missions"
					/>
				</Grid>
			</Grid>

			<Card
				elevation={0}
				sx={{
					borderRadius: 3,
					border: "1px solid #e5e7eb",
					bgcolor: "white",
				}}
			>
				<CardContent>
					<Typography variant="h6" sx={{ mb: 1 }}>
						Recent activity
					</Typography>
					<Typography variant="body2" color="text.secondary">
						• You completed “Reduce shower time” yesterday.
						<br />
						• You started “Zero-waste lunch” mission.
						<br />
						• Community saved 210 kg CO₂ in the last 7 days.
					</Typography>
				</CardContent>
			</Card>
		</Box>
	);
}

export default DashboardHome;
