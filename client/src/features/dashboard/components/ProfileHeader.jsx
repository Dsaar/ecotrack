// src/features/dashboard/components/ProfileHeader.jsx
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";

function ProfileHeader({
	fullName,
	email,
	avatarUrl,
	avatarAlt,
	initialLetter,
	editMode,
	onToggleEdit,
}) {
	return (
		<Stack
			direction={{ xs: "column", sm: "row" }}
			spacing={3}
			alignItems={{ xs: "flex-start", sm: "center" }}
		>
			<Avatar
				src={avatarUrl || undefined}
				alt={avatarAlt}
				sx={{
					width: 64,
					height: 64,
					bgcolor: avatarUrl ? "transparent" : "#166534",
					fontSize: 28,
					fontWeight: 600,
				}}
			>
				{!avatarUrl && initialLetter}
			</Avatar>

			<Box sx={{ flexGrow: 1 }}>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="flex-start"
					sx={{ mb: 1 }}
				>
					<Box>
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
					</Box>

					<Button
						variant="outlined"
						size="small"
						onClick={onToggleEdit}
						sx={{ textTransform: "none" }}
					>
						{editMode ? "Cancel" : "Edit profile"}
					</Button>
				</Stack>
			</Box>
		</Stack>
	);
}

export default ProfileHeader;
