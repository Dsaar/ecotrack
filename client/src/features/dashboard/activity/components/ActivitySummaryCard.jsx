// client/src/features/dashboard/activity/components/ActivitySummaryCard.jsx
import { Box, Card, CardContent, Chip, Divider, Stack, Typography } from "@mui/material";
import TonePanel from "../../../dashboard/components/TonePanel";

export default function ActivitySummaryCard({
	ecoPoints,
	missionsStarted,
	favoritesCount,
	completionsCount,
	myRank,
	totals,
	pendingCount,
	rejectedCount,
	onOpenCommunity,
}) {
	return (
		<Card sx={{ flex: { xs: "unset", lg: 1.4 }, borderRadius: 2 }}>
			<CardContent>
				<Typography variant="h6" sx={{ mb: 2 }}>
					Summary
				</Typography>

				<Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
					<TonePanel tone="green" sx={{ flex: 1 }}>
						<Typography variant="caption" sx={{ opacity: 0.9 }}>
							Eco points
						</Typography>
						<Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
							{ecoPoints}
						</Typography>
					</TonePanel>

					<TonePanel tone="blue" sx={{ flex: 1 }}>
						<Typography variant="caption" sx={{ opacity: 0.9 }}>
							Missions started
						</Typography>
						<Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
							{missionsStarted}
						</Typography>
					</TonePanel>

					<TonePanel tone="indigo" sx={{ flex: 1 }}>
						<Typography variant="caption" sx={{ opacity: 0.9 }}>
							Saved missions
						</Typography>
						<Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
							{favoritesCount}
						</Typography>
					</TonePanel>

					<TonePanel tone="green" sx={{ flex: 1 }}>
						<Typography variant="caption" sx={{ opacity: 0.9 }}>
							Approved completions
						</Typography>
						<Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
							{completionsCount}
						</Typography>
					</TonePanel>

					<TonePanel
						tone="blue"
						onClick={onOpenCommunity}
						sx={{
							flex: 1,
							cursor: "pointer",
							transition: "transform 120ms ease, filter 120ms ease",
							"&:hover": { filter: "brightness(1.03)", transform: "translateY(-1px)" },
						}}
					>
						<Typography variant="caption" sx={{ opacity: 0.9 }}>
							Community rank
						</Typography>
						<Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
							{myRank?.rank ? `#${myRank.rank}` : "—"}
						</Typography>
						<Typography variant="caption" sx={{ opacity: 0.85 }}>
							of {myRank?.totalUsers ?? "—"}
						</Typography>
					</TonePanel>
				</Stack>

				<Divider sx={{ my: 2 }} />

				<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
					<Chip label={`CO₂ saved: ${totals.co2Kg.toFixed(1)} kg`} variant="outlined" />
					<Chip label={`Water saved: ${totals.waterL.toFixed(0)} L`} variant="outlined" />
					<Chip label={`Waste saved: ${totals.wasteKg.toFixed(1)} kg`} variant="outlined" />
				</Stack>

				<Divider sx={{ my: 2 }} />

				<Stack direction="row" spacing={1.5} flexWrap="wrap">
					<Chip label={`Pending: ${pendingCount}`} variant="outlined" />
					<Chip label={`Rejected: ${rejectedCount}`} variant="outlined" />
				</Stack>

				<Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
					Check-ins are created automatically when an admin approves your submission.
				</Typography>
			</CardContent>
		</Card>
	);
}
