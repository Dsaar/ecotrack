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
	Popper,
	ClickAwayListener,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";

import { useUser } from "../../../app/providers/UserProvider.jsx";
import { useThemeMode } from "../../../app/providers/CustomThemeProvider.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import { useSearch } from "../../../app/providers/SearchProvider.jsx";
import { GLOBAL_SEARCH_INDEX } from "../../../app/search/globalSearchIndex.js";

function TopBar({ onToggleSidebar }) {
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
			.slice(0, 8);
	}, [query, user?.isAdmin]);

	// ✅ Avatar menu
	const [anchorEl, setAnchorEl] = useState(null);
	const openMenu = Boolean(anchorEl);

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

	// ✅ When selecting from dropdown -> navigate (global search only)
	const handleSelect = (_e, value) => {
		// value can be option object OR string (freeSolo)
		const picked =
			typeof value === "string"
				? options.find((o) => o.label.toLowerCase() === value.toLowerCase())
				: value;

		if (!picked?.path) return;

		navigate(picked.path);

		// ✅ Clear AFTER Autocomplete does its internal "reset"
		setTimeout(() => setQuery(""), 0);
	};


	// ✅ Mobile search popper
	const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
	const searchBtnRef = useRef(null);
	const mobileSearchAnchorRef = useRef(null);


	const closeMobileSearch = () => setMobileSearchOpen(false);
	const toggleMobileSearch = () => setMobileSearchOpen((v) => !v);

	return (
		<Box
			sx={{
				position: "sticky",
				top: 0,
				zIndex: (t) => t.zIndex.appBar,
				px: { xs: 1, sm: 2, md: 3 },
				py: { xs: 1, sm: 2 },
				borderBottom: "1px solid",
				borderColor: "divider",
				bgcolor: "background.paper",

				display: "flex",
				alignItems: "center",
				gap: { xs: 0.75, sm: 1.5 },
				width: "100%",
				minWidth: 0,
				overflow: "hidden",
			}}
		>
			{/* ✅ Mobile hamburger (does nothing on desktop) */}
			<Box sx={{ display: { xs: "flex", md: "none" } }}>
				<IconButton
					onClick={onToggleSidebar}
					size="small"
					sx={{ mr: 0.5 }}
					aria-label="Open menu"
				>
					<MenuIcon />
				</IconButton>
			</Box>

			{/* Left side text */}
			<Box sx={{ flex: 1, minWidth: 0 }}>
				<Typography
					variant="h6"
					sx={{
						fontWeight: 600,
						fontSize: { xs: 15, sm: 18 },
						lineHeight: 1.2,
					}}
					noWrap
				>
					{`Welcome back, ${displayName}`}
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ display: { xs: "none", sm: "block" } }}
					noWrap
				>
					Here&apos;s your EcoTrack dashboard.
				</Typography>
			</Box>

			{/* ✅ Desktop search (sm+) */}
			<Box
				sx={{
					width: 320,
					display: { xs: "none", sm: "block" },
					minWidth: 0,
				}}
			>
				<Autocomplete
					freeSolo
					disableClearable
					options={isInPageSearch ? [] : options}
					getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
					filterOptions={(x) => x}
					onChange={isInPageSearch ? undefined : handleSelect}
					inputValue={query || ""}
					onInputChange={(_e, value, reason) => {
						// ✅ ignore MUI "reset" that re-inserts the selected label
						if (reason === "reset") return;
						setQuery(value);
					}}

					open={!isInPageSearch && !!(query || "").trim() && options.length > 0}
					PaperComponent={(props) => (
						<Paper
							{...props}
							elevation={6}
							sx={{
								borderRadius: 1.5,
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
							</Box>
						</li>
					)}
				/>
			</Box>

			{/* ✅ Mobile search icon (xs) */}
			<IconButton
				ref={searchBtnRef}
				onClick={toggleMobileSearch}
				size="small"
				sx={{ display: { xs: "inline-flex", sm: "none" } }}
				aria-label="Search"
			>
				<SearchIcon />
			</IconButton>

			{/* ✅ Mobile search dropdown panel */}
			{/* ✅ Mobile search dropdown panel (anchored to the search bar itself) */}
			<Popper
				open={mobileSearchOpen}
				anchorEl={searchBtnRef.current}
				placement="bottom-start"
				modifiers={[
					{ name: "offset", options: { offset: [0, 8] } },
					{ name: "preventOverflow", options: { padding: 12 } },
				]}
				style={{ zIndex: 2000, width: mobileSearchAnchorRef.current ? mobileSearchAnchorRef.current.offsetWidth : undefined }}
			>
				<ClickAwayListener onClickAway={closeMobileSearch}>
					<Paper
						ref={mobileSearchAnchorRef}
						elevation={8}
						sx={{
							width: "min(92vw, 360px)",
							p: 1.25,
							borderRadius: 2,
							border: "1px solid",
							borderColor: "divider",
						}}
					>
						<Autocomplete
							freeSolo
							disableClearable
							options={isInPageSearch ? [] : options}
							getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
							filterOptions={(x) => x}
							onChange={
								isInPageSearch
									? undefined
									: (_e, value) => {
										handleSelect(_e, value);
										closeMobileSearch();
									}
							}
							inputValue={query || ""}
							onInputChange={(_e, value, reason) => {
								if (reason === "reset") return;
								setQuery(value);
							}}

							open={!isInPageSearch && !!(query || "").trim() && options.length > 0}
							disablePortal // ✅ IMPORTANT: keeps listbox in this panel (directly under input)
							ListboxProps={{
								style: {
									maxHeight: 260,
									overflow: "auto",
								},
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									autoFocus
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
									</Box>
								</li>
							)}
						/>
					</Paper>
				</ClickAwayListener>
			</Popper>


			{/* Theme toggle */}
			<IconButton onClick={toggleColorMode} size="small">
				{isDark ? <LightModeIcon /> : <DarkModeIcon />}
			</IconButton>

			{/* Avatar */}
			<IconButton onClick={handleAvatarClick} size="small" sx={{ flexShrink: 0 }}>
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

			<Menu
				anchorEl={anchorEl}
				open={openMenu}
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
