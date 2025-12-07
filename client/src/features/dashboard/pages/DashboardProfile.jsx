import {
	Avatar,
	Box,
	Chip,
	Divider,
	Grid,
	Paper,
	Stack,
	Typography,
} from "@mui/material";
import { useUser } from "../../../app/providers/UserProvider.jsx";
import LoadingSpinner from "../../../components/common/LoadingSpinner.jsx";

function DashboardProfile() {
	const { user, initializing } = useUser();

	if (initializing) {
		return (
			<Box sx={{ p: 3 }}>
				<LoadingSpinner />
			</Box>
		);
	}

	if (!user) {
		return (
			<Box sx={{ p: 3 }}>
				<Typography variant="h6">No user loaded</Typography>
				<Typography variant="body2" color="text.secondary">
					Please log in again to view your profile.
				</Typography>
			</Box>
		);
	}

	const nameObj = user.name || {};
	const address = user.address || {};
	const avatar = user.avatarUrl || {};

	const fullName = [
		nameObj.first,
		nameObj.middle,
		nameObj.last,
	]
		.filter(Boolean)
		.join(" ");

	const location = [
		address.city,
		address.street && `${address.street} ${address.houseNumber || ""}`.trim(),
		address.country,
	]
		.filter(Boolean)
		.join(" · ");

	const points = user.points ?? 0;
	const missionsCount = user.missions?.length ?? 0;
	const submissionsCount = user.submissions?.length ?? 0;

	return (
		<Box sx={{ p: { xs: 2, md: 3 } }}>
			{/* Header */}
			<Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
				Your profile
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
				Manage your EcoTrack identity and see your mission stats.
			</Typography>

			<Grid container spacing={3}>
				{/* Left: main profile card */}
				<Grid item xs={12} md={6}>
					<Paper
						elevation={0}
						sx={{
							p: 3,
							borderRadius: 3,
							border: "1px solid",
							borderColor: "divider",
						}}
					>
						<Stack direction="row" spacing={2} alignItems="center">
							<Avatar
								src={avatar.url}
								alt={avatar.alt || fullName || user.email}
								sx={{ width: 72, height: 72, fontSize: 28, bgcolor: "#166534" }}
							>
								{fullName ? fullName[0]?.toUpperCase() : user.email[0]?.toUpperCase()}
							</Avatar>

							<Box>
								<Typography variant="h6" sx={{ fontWeight: 600 }}>
									{fullName || user.email}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{user.email}
								</Typography>

								<Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
									{user.role && (
										<Chip
											size="small"
											label={user.role === "admin" ? "Admin" : "Member"}
											color={user.role === "admin" ? "secondary" : "default"}
											variant="outlined"
										/>
									)}
									{location && (
										<Chip size="small" label={location} variant="outlined" />
									)}
								</Stack>
							</Box>
						</Stack>

						<Divider sx={{ my: 3 }} />

						<Stack spacing={1}>
							<Typography variant="subtitle2">Contact</Typography>
							<Typography variant="body2" color="text.secondary">
								Phone: {user.phone || "Not provided"}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Country: {address.country || "Not provided"}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								City: {address.city || "Not provided"}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Street:{" "}
								{address.street
									? `${address.street} ${address.houseNumber || ""}`.trim()
									: "Not provided"}
							</Typography>
						</Stack>
					</Paper>
				</Grid>

				{/* Right: stats card */}
				<Grid item xs={12} md={6}>
					<Paper
						elevation={0}
						sx={{
							p: 3,
							borderRadius: 3,
							border: "1px solid",
							borderColor: "divider",
						}}
					>
						<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
							Mission stats
						</Typography>

						<Grid container spacing={2}>
							<Grid item xs={12} sm={4}>
								<Box>
									<Typography
										variant="h5"
										sx={{ fontWeight: 700, color: "primary.main" }}
									>
										{points}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Eco points
									</Typography>
								</Box>
							</Grid>
							<Grid item xs={12} sm={4}>
								<Box>
									<Typography variant="h5" sx={{ fontWeight: 700 }}>
										{missionsCount}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Active missions
									</Typography>
								</Box>
							</Grid>
							<Grid item xs={12} sm={4}>
								<Box>
									<Typography variant="h5" sx={{ fontWeight: 700 }}>
										{submissionsCount}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Submissions
									</Typography>
								</Box>
							</Grid>
						</Grid>

						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ mt: 2 }}
						>
							As you complete missions, your points and impact stats will grow
							here. Later we can display detailed CO₂, water and waste savings.
						</Typography>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}

export default DashboardProfile;
