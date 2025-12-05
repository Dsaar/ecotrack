import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

function StatCard({ label, value, description }) {
	return (
		<Card
			elevation={0}
			sx={{
				borderRadius: 3,
				border: "1px solid",
				borderColor: "divider",
				bgcolor: "background.paper",
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
				{/* ... same content, just using StatCard ... */}
			</Grid>

			<Card
				elevation={0}
				sx={{
					borderRadius: 3,
					border: "1px solid",
					borderColor: "divider",
					bgcolor: "background.paper",
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
