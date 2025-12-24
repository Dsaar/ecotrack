// src/features/dashboard/components/MissionImpactPanel.jsx
import {
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	Stack,
	Typography,
} from "@mui/material";

function StatChip({ label, value, unit }) {
	if (value == null) return null;

	return (
		<Box
			sx={{
				px: 2,
				py: 1,
				borderRadius: 999,
				bgcolor: "background.paper",
				border: "1px solid",
				borderColor: "divider",
				minWidth: 0,
			}}
		>
			<Typography variant="caption" color="text.secondary">
				{label}
			</Typography>
			<Typography variant="body2" sx={{ fontWeight: 600 }}>
				{value} {unit}
			</Typography>
		</Box>
	);
}

function MissionImpactPanel({
	estImpact,
	error,
	onViewImpact,
}) {
	return (
		<Stack
			spacing={2}
			sx={{
				flex: 1,
				minWidth: { xs: "100%", md: 280 },
			}}
		>
			<Card
				elevation={0}
				sx={{
					borderRadius: 3,
					border: "1px solid",
					borderColor: "divider",
					bgcolor: "background.paper",
				}}
			>
				<CardContent sx={{ p: 3 }}>
					<Typography
						variant="subtitle2"
						color="text.secondary"
						sx={{ mb: 1 }}
					>
						Estimated impact
					</Typography>

					<Stack direction="column" spacing={1.5}>
						<StatChip
							label="CO₂ reduction"
							value={estImpact?.co2Kg}
							unit="kg"
						/>
						<StatChip label="Water saved" value={estImpact?.waterL} unit="L" />
						<StatChip
							label="Waste diverted"
							value={estImpact?.wasteKg}
							unit="kg"
						/>
					</Stack>

					<Divider sx={{ my: 2 }} />

					{error && (
						<Typography
							variant="body2"
							sx={{ mb: 1, color: "error.main", fontWeight: 500 }}
						>
							{error}
						</Typography>
					)}

					<Stack direction="column" spacing={1.5}>
						<Button
							variant="text"
							fullWidth
							sx={{ textTransform: "none" }}
							onClick={onViewImpact}
						>
							View my impact →
						</Button>
					</Stack>
				</CardContent>
			</Card>
		</Stack>
	);
}

export default MissionImpactPanel;
