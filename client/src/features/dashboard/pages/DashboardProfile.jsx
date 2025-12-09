import { Box, Typography } from "@mui/material";
import { useUser } from "../../../app/providers/UserProvider.jsx";
import ProfileMainCard from "../components/ProfileMainCard.jsx";

function DashboardProfile() {
	const { user } = useUser();

	const displayName =
		user?.name?.first || user?.email || "EcoTrack member";

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900 }}>
			<Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
				Your profile
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
				Manage your EcoTrack identity and contact details, {displayName}.
			</Typography>

			{/* Main profile card (avatar + contact + edit) */}
			<ProfileMainCard />
		</Box>
	);
}

export default DashboardProfile;
