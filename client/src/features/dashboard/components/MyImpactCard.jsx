// src/features/dashboard/components/MyImpactCard.jsx
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

function ImpactStat({ label, value, unit }) {
	return (
		<Box>
			<Typography variant="h5" sx={{ fontWeight: 600, color: "#166534" }}>
				{value}
				{unit ? ` ${unit}` : ""}
			</Typography>
			<Typography variant="body2" color="text.secondary">
				{label}
			</Typography>
		</Box>
	);
}

function MyImpactCard({ totals }) {
	const {
		co2SavedKg = 0,
		waterSavedL = 0,
		wasteDivertedKg = 0,
		submissionsApproved = 0,
	} = totals || {};

	return (
		<Card sx={{ borderRadius: 4, mb: 3 }}>
			<CardContent>
				<Typography variant="h6" sx={{ mb: 2 }}>
					My impact so far
				</Typography>

				<Stack
					direction={{ xs: "column", sm: "row" }}
					spacing={3}
					alignItems="flex-start"
				>
					<ImpactStat
						label="Approved mission submissions"
						value={submissionsApproved}
						unit=""
					/>
					<ImpactStat
						label="Estimated CO₂ saved"
						value={co2SavedKg}
						unit="kg"
					/>
					<ImpactStat
						label="Estimated water saved"
						value={waterSavedL}
						unit="L"
					/>
					<ImpactStat
						label="Waste diverted from landfill"
						value={wasteDivertedKg}
						unit="kg"
					/>
				</Stack>

				<Typography
					variant="caption"
					color="text.secondary"
					sx={{ display: "block", mt: 2 }}
				>
					These numbers are based on your approved mission submissions and the
					estimated impact of each mission.
				</Typography>
			</CardContent>
		</Card>
	);
}

export default MyImpactCard;
