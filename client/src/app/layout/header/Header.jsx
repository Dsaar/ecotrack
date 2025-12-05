import {
	AppBar,
	Box,
	Button,
	Container,
	Stack,
	Toolbar,
	IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import Logo from "../../../components/common/Logo.jsx";
import { useUser } from "../../providers/UserProvider.jsx";
import { useThemeMode } from "../../providers/CustomThemeProvider.jsx";

function Header() {
	const navigate = useNavigate();
	const { user, logout } = useUser();
	const { mode, toggleColorMode } = useThemeMode();

	const isDark = mode === "dark";

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	return (
		<AppBar
			position="static"
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
						<Button
							sx={{ textTransform: "none" }}
							color="inherit"
							onClick={() => navigate("/missions")}
						>
							Missions
						</Button>
						<Button sx={{ textTransform: "none" }} color="inherit" onClick={() => navigate("/missions")}>
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
							{isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
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
		</AppBar>
	);
}

export default Header;
