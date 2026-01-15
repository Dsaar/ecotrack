// client/src/features/dashboard/pages/DashboardActivity.jsx
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useUser } from "../../../app/providers/UserProvider.jsx";
import { useCommunity } from "../../../app/providers/CommunityProvider.jsx";
import LoadingSpinner from "../../../components/common/LoadingSpinner.jsx";

import useDashboardActivity from "../activity/hooks/useDashboardActivity.js";
import ActivitySummaryCard from "../activity/components/ActivitySummaryCard.jsx";
import ActivityTabs from "../activity/components/ActivityTabs.jsx";
import ApprovedList from "../activity/components/ApprovedList.jsx";
import PendingList from "../activity/components/PendingList.jsx";
import RejectedList from "../activity/components/RejectedList.jsx";

export default function DashboardActivity() {
	const { user } = useUser();
	const navigate = useNavigate();

	const { communityData } = useCommunity();
	const myRank = communityData?.myRank?.byPoints;

	const { checkins, pendingSubs, rejectedSubs, totals, loading, error, tab, setTab } =
		useDashboardActivity();

	// Summary stats
	const ecoPoints = user?.points ?? 0;
	const missionsStarted = user?.missions?.length ?? 0;
	const favoritesCount = user?.favorites?.missions?.length ?? 0;
	const completionsCount = checkins.length;

	if (loading) return <LoadingSpinner fullScreen={false} />;

	return (
		<Box
			sx={(theme) => ({
				p: { xs: 2, md: 3 },
				maxWidth: 1130,
				position: "relative",
				"&:before": {
					content: '""',
					position: "absolute",
					left: 0,
					right: 0,
					top: 0,
					height: 190,
					borderRadius: 2,
					background: theme.palette?.tones?.blue?.bg
						? `linear-gradient(180deg, ${theme.palette.tones.blue.bg} 0%, transparent 75%)`
						: "linear-gradient(180deg, rgba(59,130,246,0.12) 0%, transparent 75%)",
					pointerEvents: "none",
				},
			})}
		>
			<Box sx={{ position: "relative" }}>
				<Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
					My missions & activity
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
					Your approved completions are recorded as check-ins, including points and impact.
				</Typography>

				{error && (
					<Typography color="error" sx={{ mb: 2 }}>
						{error}
					</Typography>
				)}

				<Stack direction={{ xs: "column", lg: "row" }} spacing={3} alignItems="stretch">
					<ActivitySummaryCard
						ecoPoints={ecoPoints}
						missionsStarted={missionsStarted}
						favoritesCount={favoritesCount}
						completionsCount={completionsCount}
						myRank={myRank}
						totals={totals}
						pendingCount={pendingSubs.length}
						rejectedCount={rejectedSubs.length}
						onOpenCommunity={() => navigate("/dashboard/community")}
					/>

					<Card sx={{ flex: { xs: "unset", lg: 1.4 }, borderRadius: 2 }}>
						<CardContent>
							<Typography variant="h6" sx={{ mb: 1 }}>
								Activity
							</Typography>

							<ActivityTabs
								tab={tab}
								setTab={setTab}
								checkinsCount={checkins.length}
								pendingCount={pendingSubs.length}
								rejectedCount={rejectedSubs.length}
							/>

							{tab === "approved" && (
								<ApprovedList
									checkins={checkins}
									onOpenMission={(missionId) => navigate(`/dashboard/missions/${missionId}`)}
								/>
							)}

							{tab === "pending" && (
								<PendingList
									items={pendingSubs}
									onOpenMission={(missionId) => navigate(`/dashboard/missions/${missionId}`)}
								/>
							)}

							{tab === "rejected" && (
								<RejectedList
									items={rejectedSubs}
									onOpenMission={(missionId) => navigate(`/dashboard/missions/${missionId}`)}
								/>
							)}
						</CardContent>
					</Card>
				</Stack>
			</Box>
		</Box>
	);
}
