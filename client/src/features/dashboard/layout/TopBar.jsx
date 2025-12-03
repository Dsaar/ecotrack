import { Box, TextField, InputAdornment, Avatar, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function TopBar() {
	return (
		<Box
			sx={{
				px: { xs: 2, md: 3 },
				py: 2,
				borderBottom: "1px solid #e5e7eb",
				bgcolor: "white",
				display: "flex",
				alignItems: "center",
				gap: 2,
			}}
		>
			<Box sx={{ flexGrow: 1 }}>
				<Typography variant="h6" sx={{ fontWeight: 600 }}>
					Welcome back
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Here’s an overview of your EcoTrack activity.
				</Typography>
			</Box>

			<TextField
				size="small"
				placeholder="Search missions"
				sx={{ maxWidth: 260, display: { xs: "none", sm: "block" } }}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<SearchIcon fontSize="small" />
						</InputAdornment>
					),
				}}
			/>

			<Avatar
				sx={{
					bgcolor: "#166534",
					width: 36,
					height: 36,
					fontSize: 16,
				}}
			>
				U
			</Avatar>
		</Box>
	);
}

export default TopBar;
