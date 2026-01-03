import { useState } from "react";
import {
	AppBar,
	Box,
	Button,
	Container,
	Stack,
	Toolbar,
	IconButton,
	Drawer,
	List,
	ListItemButton,
	ListItemText,
	Divider,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "../../../components/common/Logo.jsx";
import { useUser } from "../../providers/UserProvider.jsx";
import { useThemeMode } from "../../providers/CustomThemeProvider.jsx";

function Header() {
	const navigate = useNavigate();
	const location = useLocation();
	const { user, logout } = useUser();
	const { mode, toggleColorMode } = useThemeMode();

	const [mobileOpen, setMobileOpen] = useState(false);

	const isDark = mode === "dark";

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	const closeDrawer = () => setMobileOpen(false);
	const toggleDrawer = () => setMobileOpen((v) => !v);

	// ✅ Impact behavior:
	// - If you are already on "/", scroll to #impact
	// - Otherwise navigate to "/#impact"
	const goImpact = () => {
		closeDrawer();

		if (location.pathname === "/") {
			const el = document.querySelector("#impact");
			if (el) {
				el.scrollIntoView({ behavior: "smooth", block: "start" });
			}
			return;
		}

		navigate("/#impact");
	};

	const goMissions = () => {
		closeDrawer();
		navigate("/missions");
	};

	const goDashboard = () => {
		closeDrawer();
		navigate("/dashboard");
	};

	const goLogin = () => {
		closeDrawer();
		navigate("/login");
	};

	const goRegister = () => {
		closeDrawer();
		navigate("/register");
	};

	return (
		<AppBar
			position="sticky"
			elevation={0}
			sx={{
				bgcolor: "background.paper",
				color: "inherit",
				borderBottom: "1px solid",
				borderColor: "divider",
			}}
		>
			<Container maxWidth="lg">
				<Toolbar
					disableGutters
					sx={{
						py: 1.5,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 1,
					}}
				>
					{/* ✅ Mobile hamburger (only on mobile) */}
					<IconButton
						onClick={toggleDrawer}
						size="small"
						aria-label="Open menu"
						sx={{ display: { xs: "inline-flex", md: "none" } }}
					>
						<MenuIcon />
					</IconButton>

					{/* Logo */}
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							cursor: "pointer",
						}}
						onClick={() => navigate("/")}
					>
						<Logo height={36} />
					</Box>

					{/* Center nav (hidden on mobile) */}
					<Stack
						direction="row"
						spacing={3}
						sx={{
							flexGrow: 1,
							justifyContent: "center",
							display: { xs: "none", md: "flex" },
						}}
					>
						<Button sx={{ textTransform: "none" }} color="inherit" onClick={goMissions}>
							Missions
						</Button>
						<Button sx={{ textTransform: "none" }} color="inherit" onClick={goImpact}>
							Impact
						</Button>
					</Stack>

					{/* Right side: theme toggle + auth */}
					<Stack
						direction="row"
						spacing={{ xs: 0.5, sm: 1.5 }}
						alignItems="center"
						sx={{ ml: { xs: "auto", md: 0 } }}
					>
						{/* Theme toggle */}
						<IconButton size="small" onClick={toggleColorMode}>
							{isDark ? (
								<LightModeIcon fontSize="small" />
							) : (
								<DarkModeIcon fontSize="small" />
							)}
						</IconButton>

						{user ? (
							<>
								<Button
									size="small"
									variant="text"
									sx={{ textTransform: "none" }}
									onClick={() => navigate("/dashboard")}
								>
									Dashboard
								</Button>
								<Button
									size="small"
									variant="outlined"
									color="inherit"
									sx={{ textTransform: "none" }}
									onClick={handleLogout}
								>
									Log out
								</Button>
							</>
						) : (
							<>
								<Button
									size="small"
									variant="outlined"
									color="inherit"
									sx={{
										textTransform: "none",
										px: { xs: 1.8, sm: 2.5 },
									}}
									onClick={() => navigate("/login")}
								>
									Log in
								</Button>
								<Button
									size="small"
									variant="contained"
									sx={{
										textTransform: "none",
										bgcolor: "#166534",
										px: { xs: 2, sm: 3 },
										"&:hover": { bgcolor: "#14532d" },
									}}
									onClick={() => navigate("/register")}
								>
									Sign up
								</Button>
							</>
						)}
					</Stack>
				</Toolbar>
			</Container>

			{/* ✅ Mobile Drawer menu */}
			<Drawer
				anchor="left"
				open={mobileOpen}
				onClose={closeDrawer}
				PaperProps={{
					sx: {
						width: 280,
						bgcolor: "background.paper",
					},
				}}
			>
				<Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
					<Logo height={28} />
				</Box>
				<Divider />

				<List>
					<ListItemButton onClick={goMissions}>
						<ListItemText primary="Missions" />
					</ListItemButton>
					<ListItemButton onClick={goImpact}>
						<ListItemText primary="Impact" />
					</ListItemButton>
				</List>

				<Divider />

				<List>
					{user ? (
						<>
							<ListItemButton onClick={goDashboard}>
								<ListItemText primary="Dashboard" />
							</ListItemButton>
							<ListItemButton
								onClick={() => {
									closeDrawer();
									handleLogout();
								}}
							>
								<ListItemText primary="Log out" />
							</ListItemButton>
						</>
					) : (
						<>
							<ListItemButton onClick={goLogin}>
								<ListItemText primary="Log in" />
							</ListItemButton>
							<ListItemButton onClick={goRegister}>
								<ListItemText primary="Sign up" />
							</ListItemButton>
						</>
					)}
				</List>
			</Drawer>
		</AppBar>
	);
}

export default Header;
