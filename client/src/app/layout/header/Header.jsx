// src/app/layout/header/Header.jsx
import {
	AppBar,
	Box,
	Button,
	Container,
	Stack,
	Toolbar,
} from "@mui/material";
import Logo from "../../../components/common/Logo.jsx";
import { useNavigate } from "react-router-dom";

function Header() {
	const navigate = useNavigate();

	return (
		<AppBar
			position="static"
			elevation={0}
			sx={{
				bgcolor: "transparent",
				color: "inherit",
				borderBottom: "1px solid #e5e7eb",
			}}
		>
			<Container maxWidth="lg">
				<Toolbar disableGutters sx={{ py: 1.5 }}>
					{/* Logo */}
					<Box sx={{ display: "flex", alignItems: "center", mr: 4, cursor: "pointer" }} onClick={() => navigate("/")}>						
					<Logo height={40} />
					</Box>

					{/* Center nav links – hidden on small screens for now */}
					<Stack
						direction="row"
						spacing={3}
						sx={{
							flexGrow: 1,
							justifyContent: "center",
							display: { xs: "none", md: "flex" },
						}}
					>
						<Button sx={{ textTransform: "none" }} color="inherit">
							Features
						</Button>
						<Button sx={{ textTransform: "none" }} color="inherit" onClick={() => navigate("/missions")}>
							Missions
						</Button>
						<Button sx={{ textTransform: "none" }} color="inherit">
							Impact
						</Button>
					</Stack>

					{/* Right side: auth buttons */}
					<Stack direction="row" spacing={2}>
						<Button
							variant="outlined"
							color="inherit"
							sx={{ textTransform: "none" }}
							onClick={() => navigate("/login")}
						>
							Log in
						</Button>
						<Button
							variant="contained"
							sx={{
								textTransform: "none",
								bgcolor: "#166534",
								"&:hover": { bgcolor: "#14532d" },
							}}
							onClick={() => navigate("/register")}

						>
							Sign up
						</Button>
					</Stack>
				</Toolbar>
			</Container>
		</AppBar>
	);
}

export default Header;
