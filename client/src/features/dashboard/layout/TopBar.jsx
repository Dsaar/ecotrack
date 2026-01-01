// src/features/dashboard/layout/TopBar.jsx
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
	Autocomplete,
	Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useUser } from "../../../app/providers/UserProvider.jsx";
import { useThemeMode } from "../../../app/providers/CustomThemeProvider.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { useSearch } from "../../../app/providers/SearchProvider.jsx";
import { GLOBAL_SEARCH_INDEX } from "../../../app/search/globalSearchIndex.js";

function TopBar() {
	const { user, logout } = useUser();
	const { mode, toggleColorMode } = useThemeMode();
	const navigate = useNavigate();
	const location = useLocation();
	const { query, setQuery } = useSearch();

	// ✅ Pages where search is "in-page filter" (no navigation dropdown behavior)
	const IN_PAGE_SEARCH_PREFIXES = [
		"/dashboard/missions",
		"/dashboard/favorites",
		"/dashboard/admin/users",
	];

	const isInPageSearch = IN_PAGE_SEARCH_PREFIXES.some((p) =>
		location.pathname.startsWith(p)
	);

	// ✅ Build display name
	const displayName = (() => {
		if (!user) return "EcoTrack User";
		if (user.name && typeof user.name === "object") {
			const first = user.name.first || user.name.firstName;
			const last = user.name.last || user.name.lastName;
			const full = [first, last].filter(Boolean).join(" ");
			if (full) return full;
		}
		if (typeof user.name === "string") return user.name;
		if (user.email) return user.email;
		return "EcoTrack User";
	})();

	// ✅ Dropdown options (filtered by query + adminOnly)
	const options = useMemo(() => {
		const q = (query || "").trim().toLowerCase();
		if (!q) return [];

		return GLOBAL_SEARCH_INDEX
			.filter((item) => {
				if (item.adminOnly && !user?.isAdmin) return false;

				const hay = `${item.label} ${(item.keywords || []).join(" ")}`.toLowerCase();
				return hay.includes(q);
			})
			.slice(0, 8); // keep it tidy
	}, [query, user?.isAdmin]);

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
	const handleCloseMenu = () => setAnchorEl(null);

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

	// ✅ When selecting from dropdown -> navigate
	const handleSelect = (_e, value) => {
		if (!value?.path) return;
		navigate(value.path);
		// optional: clear query after navigation
		setQuery("");
	};

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
			{/* Left side */}
			<Box sx={{ flexGrow: 1, minWidth: 0 }}>
				<Typography variant="h6" sx={{ fontWeight: 600 }} noWrap>
					{`Welcome back, ${displayName}`}
				</Typography>
				<Typography variant="body2" color="text.secondary" noWrap>
					Here&apos;s your EcoTrack dashboard.
				</Typography>
			</Box>

			{/* ✅ Global Search: in-page filter OR dropdown nav depending on route */}
			<Box sx={{ width: { xs: "100%", sm: 320 }, display: { xs: "none", sm: "block" } }}>
				<Autocomplete
					freeSolo
					disableClearable
					options={isInPageSearch ? [] : options}
					getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
					filterOptions={(x) => x} // we already filter via options memo
					onChange={isInPageSearch ? undefined : handleSelect}
					inputValue={query || ""}
					onInputChange={(_e, value) => setQuery(value)}
					open={!isInPageSearch && !!(query || "").trim() && options.length > 0}
					PaperComponent={(props) => (
						<Paper
							{...props}
							elevation={6}
							sx={{
								borderRadius: 0.5,
								mt: 1,
								overflow: "hidden",
								border: "1px solid",
								borderColor: "divider",
							}}
						/>
					)}
					renderInput={(params) => (
						<TextField
							{...params}
							size="small"
							placeholder={isInPageSearch ? "Search on this page…" : "Search EcoTrack…"}
							InputProps={{
								...params.InputProps,
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon fontSize="small" />
									</InputAdornment>
								),
							}}
						/>
					)}
					renderOption={(props, option) => (
						<li {...props} key={option.path}>
							<Box sx={{ display: "flex", flexDirection: "column", py: 0.25 }}>
								<Typography sx={{ fontSize: 14, fontWeight: 700 }}>
									{option.label}
								</Typography>
{/* 								<Typography sx={{ fontSize: 12 }} color="text.secondary">
									{option.path}
								</Typography> */}
							</Box>
						</li>
					)}
				/>
			</Box>

			{/* Theme toggle */}
			<IconButton onClick={toggleColorMode} sx={{ ml: 1 }}>
				{isDark ? <LightModeIcon /> : <DarkModeIcon />}
			</IconButton>

			{/* Avatar */}
			<Stack direction="row" spacing={2} alignItems="center">
				<IconButton onClick={handleAvatarClick} size="small">
					<Avatar
						src={user?.avatarUrl?.url || user?.avatarUrl || undefined}
						alt={displayName}
						sx={{
							bgcolor: "#166534",
							width: 36,
							height: 36,
							fontSize: 16,
						}}
					>
						{displayName.charAt(0).toUpperCase()}
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
