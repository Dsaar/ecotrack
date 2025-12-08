// src/features/dashboard/pages/DashboardProfile.jsx
import {
	Avatar,
	Box,
	Card,
	CardContent,
	Divider,
	Stack,
	Typography,
} from "@mui/material";
import { useUser } from "../../../app/providers/UserProvider.jsx";

function getFullName(name) {
	if (!name) return "";
	return [name.first, name.middle, name.last].filter(Boolean).join(" ");
}

function DashboardProfile() {
	const { user } = useUser();

	// --- Basic identity ---
	const fullName = getFullName(user?.name) || "EcoTrack member";
	const email = user?.email || "No email";

	// --- Contact / address pulled from backend shape ---
	const phone = user?.phone || "Not provided";

	const country = user?.address?.country || "Not provided";
	const city = user?.address?.city || "Not provided";
	const street =
		user?.address?.street
			? `${user.address.street}${user.address.houseNumber ? " " + user.address.houseNumber : ""
			}`
			: "Not provided";

	// --- Mission stats from user document ---
	const ecoPoints = user?.points ?? 0;
	const activeMissions = user?.missions?.length ?? 0;
	const submissionsCount = user?.submissions?.length ?? 0;

	// --- Avatar data + fallback initial ---
	const avatarUrl = user?.avatarUrl?.url || "";
	const avatarAlt =
		user?.avatarUrl?.alt || fullName || "EcoTrack user avatar";
	const avatarInitial =
		(fullName[0] ||
			user?.name?.first?.[0] ||
			user?.email?.[0] ||
			"U"
		).toUpperCase();

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900 }}>
			<Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
				Your profile
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
				Manage your EcoTrack identity and see your mission stats.
			</Typography>

			{/* Profile card */}
			<Card sx={{ mb: 3, borderRadius: 4 }}>
				<CardContent>
					<Stack
						direction={{ xs: "column", sm: "row" }}
						spacing={3}
						alignItems={{ xs: "flex-start", sm: "center" }}
					>
						{/* Avatar with image or fallback initial */}
						<Avatar
							src={avatarUrl || undefined}
							alt={avatarAlt}
							sx={{
								width: 64,
								height: 64,
								bgcolor: avatarUrl ? "transparent" : "#166534",
								color: avatarUrl ? "inherit" : "white",
								fontSize: 28,
								fontWeight: 600,
							}}
						>
							{!avatarUrl && avatarInitial}
						</Avatar>

						<Box sx={{ flexGrow: 1 }}>
							<Typography variant="h6" sx={{ fontWeight: 600 }}>
								{fullName}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{email}
							</Typography>
							<Box sx={{ mt: 1 }}>
								<Typography
									variant="caption"
									sx={{
										px: 1.5,
										py: 0.5,
										borderRadius: 999,
										border: "1px solid #e5e7eb",
									}}
								>
									Member
								</Typography>
							</Box>

							<Divider sx={{ my: 2 }} />

							<Typography variant="subtitle2" sx={{ mb: 1 }}>
								Contact
							</Typography>
							<Typography variant="body2" color="text.secondary">
								<strong>Phone:</strong> {phone}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								<strong>Country:</strong> {country}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								<strong>City:</strong> {city}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								<strong>Street:</strong> {street}
							</Typography>
						</Box>
					</Stack>
				</CardContent>
			</Card>

			{/* Mission stats */}
			<Card sx={{ borderRadius: 4 }}>
				<CardContent>
					<Typography variant="h6" sx={{ mb: 2 }}>
						Mission stats
					</Typography>

					<Stack
						direction={{ xs: "column", sm: "row" }}
						spacing={4}
						sx={{ mb: 2 }}
					>
						<Box>
							<Typography variant="h5" sx={{ fontWeight: 600, color: "#166534" }}>
								{ecoPoints}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Eco points
							</Typography>
						</Box>

						<Box>
							<Typography variant="h5" sx={{ fontWeight: 600 }}>
								{activeMissions}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Active missions
							</Typography>
						</Box>

						<Box>
							<Typography variant="h5" sx={{ fontWeight: 600 }}>
								{submissionsCount}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Submissions
							</Typography>
						</Box>
					</Stack>

					<Typography variant="body2" color="text.secondary">
						As you complete missions, your points and impact stats will grow
						here. Later we can show detailed CO₂, water and waste savings
						aggregated from your submissions.
					</Typography>
				</CardContent>
			</Card>
		</Box>
	);
}

export default DashboardProfile;
