// src/features/dashboard/pages/DashboardCommunity.jsx
import { Box, Grid, Typography } from "@mui/material";

import CommunityStatsStrip from "../components/CommunitySatsStrip.jsx";
import CommunityImpactCharts from "../components/CommunityImpactCharts.jsx";
import CommunityLeaderboards from "../components/CommunityLeaderBoards.jsx";
import CommunityGoalsCard from "../components/CommunityGoalsCard.jsx";
import MyRankCard from "../components/MyRankCard.jsx";

import { useCommunity } from "../../../app/providers/CommunityProvider.jsx";
import LoadingSpinner from "../../../components/common/LoadingSpinner.jsx";

function DashboardCommunity() {
	const { communityData, loading } = useCommunity();

	if (loading || !communityData) {
		return <LoadingSpinner fullScreen={false} />;
	}

	const {
		communityStats,
		impactOverTime,
		categoryDistribution,
		leadersByPoints,
		leadersByMissions,
		myRank,
	} = communityData;

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200 }}>
			<Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
				EcoTrack Community
			</Typography>

			<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
				See what the entire EcoTrack community is achieving together – and
				where you stand.
			</Typography>

			{/* Stats strip */}
			<Box sx={{ mb: 3 }}>
				<CommunityStatsStrip stats={communityStats} />
			</Box>

			{/* My rank */}
			<Box sx={{ mb: 3 }}>
				<MyRankCard myRank={myRank} />
			</Box>

			<Grid container spacing={3}>
				{/* Charts */}
				<Grid item xs={12} md={7}>
					<CommunityImpactCharts
						impactOverTime={impactOverTime}
						categoryDistribution={categoryDistribution}
					/>
				</Grid>

				{/* Leaderboards + goals */}
				<Grid item xs={12} md={5}>
					<CommunityLeaderboards
						leadersByPoints={leadersByPoints}
						leadersByMissions={leadersByMissions}
					/>

					<Box sx={{ mt: 3 }}>
						<CommunityGoalsCard stats={communityStats} />
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}

export default DashboardCommunity;
