// src/features/dashboard/components/MyRankCard.jsx
import { Card, CardContent, Stack, Typography } from "@mui/material";

function RankLine({ label, rankInfo, unitLabel }) {
	if (!rankInfo || !rankInfo.rank) return null;

	const { rank, totalUsers, aheadOfPercent } = rankInfo;

	return (
		<Stack spacing={0.3}>
			<Typography variant="body2">
				{label}: <strong>#{rank}</strong> of {totalUsers} users
			</Typography>
			{aheadOfPercent != null && (
				<Typography variant="caption" color="text.secondary">
					You’re ahead of about {aheadOfPercent}% of the community.
				</Typography>
			)}
		</Stack>
	);
}

function MyRankCard({ myRank }) {
	if (!myRank) return null;

	return (
		<Card sx={{ borderRadius: 4 }}>
			<CardContent>
				<Typography variant="h6" sx={{ mb: 1.5 }}>
					Your rank
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
					See where you stand compared to other EcoTrack members.
				</Typography>

				<Stack spacing={1.5}>
					<RankLine label="By eco points" rankInfo={myRank.byPoints} />
					<RankLine
						label="By missions completed"
						rankInfo={myRank.byMissions}
					/>
				</Stack>
			</CardContent>
		</Card>
	);
}

export default MyRankCard;
