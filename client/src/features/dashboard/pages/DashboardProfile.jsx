// src/features/dashboard/pages/DashboardProfile.jsx
import { Box, Typography } from "@mui/material";
import { useUser } from "../../../app/providers/UserProvider.jsx";
import ProfileMainCard from "../components/ProfileMainCard.jsx";
import ProfileStatsCard from "../components/ProfileStatsCard.jsx";

function DashboardProfile() {
	const { user } = useUser();

	const ecoPoints = user?.points ?? 0;
	const activeMissions = user?.missions?.length ?? 0;
	const submissionsCount = user?.submissions?.length ?? 0;

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900 }}>
			<Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
				Your profile
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
				Manage your EcoTrack identity and see your mission stats.
			</Typography>

			<ProfileMainCard />

			<ProfileStatsCard
				ecoPoints={ecoPoints}
				activeMissions={activeMissions}
				submissionsCount={submissionsCount}
			/>
		</Box>
	);
}

export default DashboardProfile;
