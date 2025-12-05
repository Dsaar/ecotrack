import {
	Box,
	TextField,
	InputAdornment,
	Avatar,
	Typography,
	Stack,
	IconButton,
	Menu,
	MenuItem,
	Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useUser } from "../../../app/providers/UserProvider.jsx";
import { useThemeMode } from "../../../app/providers/CustomThemeProvider.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function TopBar() {
	const { user, logout } = useUser();
	const { mode, toggleColorMode } = useThemeMode();
	const navigate = useNavigate();

	const displayName = user?.name || user?.email || "EcoTrack User";

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleAvatarClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		handleCloseMenu();
		logout();
		navigate("/");
	};

	const goToProfile = () => {
		handleCloseMenu();
		navigate("/dashboard/profile");
	};

	const isDark = mode === "dark";

	return (
		<Box
			sx={{
				px: { xs: 2, md: 3 },
				py: 2,
				borderBottom: "1px solid",
				borderColor: "divider",
				bgcolor: "background.paper",
				display: "flex",
				alignItems: "center",
				gap: 2,
			}}
		>
			{/* Left side: Title */}
			<Box sx={{ flexGrow: 1 }}>
				<Typography variant="h6" sx={{ fontWeight: 600 }}>
					{`Welcome back, ${displayName}`}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Here&apos;s your EcoTrack dashboard.
				</Typography>
			</Box>

			{/* Search */}
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

			{/* Theme toggle */}
			<IconButton onClick={toggleColorMode} sx={{ ml: 1 }}>
				{isDark ? <LightModeIcon /> : <DarkModeIcon />}
			</IconButton>

			{/* Profile avatar + dropdown */}
			<Stack direction="row" spacing={2} alignItems="center">
				<IconButton onClick={handleAvatarClick} size="small">
					<Avatar
						sx={{
							bgcolor: "#166534",
							width: 36,
							height: 36,
							fontSize: 16,
						}}
					>
						{displayName[0]?.toUpperCase() || "U"}
					</Avatar>
				</IconButton>
			</Stack>

			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleCloseMenu}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				transformOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<MenuItem disabled>
					<Typography variant="body2">{displayName}</Typography>
				</MenuItem>
				<Divider />
				<MenuItem onClick={goToProfile}>Profile</MenuItem>
				<Divider />
				<MenuItem onClick={handleLogout}>Log out</MenuItem>
			</Menu>
		</Box>
	);
}

export default TopBar;
