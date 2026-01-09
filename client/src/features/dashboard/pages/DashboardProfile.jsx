import { Box, Typography } from "@mui/material";
import { useUser } from "../../../app/providers/UserProvider.jsx";
import ProfileMainCard from "../components/ProfileMainCard.jsx";

function DashboardProfile() {
	const { user } = useUser();

	const displayName = user?.name?.first || user?.email || "EcoTrack member";

	return (
		<Box
			sx={(theme) => ({
				position: "relative",
				p: { xs: 2, md: 3 },
				maxWidth: 900,

				// ✅ Top gradient overlay (theme-driven)
				"&:before": {
					content: '""',
					position: "absolute",
					borderRadius:2,
					top: 0,
					left: 0,
					right: 0,
					height: { xs: 180, md: 220 },
					background: `linear-gradient(
						180deg,
						${theme.palette.tones?.blue?.bg ?? "rgba(59,130,246,0.12)"} 0%,
						${theme.palette.tones?.green?.bg ?? "rgba(22,101,52,0.10)"} 45%,
						transparent 85%
					)`,
					// fade out smoothly (no hard bottom edge)
					maskImage:
						"linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
					WebkitMaskImage:
						"linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
					pointerEvents: "none",
					zIndex: 0,
				},

				"& > *": { position: "relative", zIndex: 1 },
			})}
		>
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
