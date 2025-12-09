// src/features/dashboard/components/CommunityGoalsCard.jsx
import {
	Card,
	CardContent,
	LinearProgress,
	Stack,
	Typography,
} from "@mui/material";

function CommunityGoalsCard({ stats }) {
	const { totalEcoPoints, goalPointsTarget } = stats;

	const progress =
		goalPointsTarget > 0
			? Math.min(100, (totalEcoPoints / goalPointsTarget) * 100)
			: 0;

	const remaining = Math.max(0, goalPointsTarget - totalEcoPoints);

	return (
		<Card sx={{ borderRadius: 4 }}>
			<CardContent>
				<Typography variant="h6" sx={{ mb: 1.5 }}>
					Community goal
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
					Next milestone: {goalPointsTarget.toLocaleString()} eco points
					collected by the EcoTrack community.
				</Typography>

				<Stack spacing={1.5}>
					<LinearProgress
						variant="determinate"
						value={progress}
						sx={{
							height: 10,
							borderRadius: 999,
						}}
					/>
					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="center"
					>
						<Typography variant="body2" color="text.secondary">
							Progress
						</Typography>
						<Typography variant="body2" sx={{ fontWeight: 600 }}>
							{progress.toFixed(0)}%
						</Typography>
					</Stack>

					<Typography variant="caption" color="text.secondary">
						{remaining > 0
							? `${remaining.toLocaleString()} points to reach the goal.`
							: "Goal reached! Time to set a new milestone."}
					</Typography>
				</Stack>
			</CardContent>
		</Card>
	);
}

export default CommunityGoalsCard;
