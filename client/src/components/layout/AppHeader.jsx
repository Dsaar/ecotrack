// src/components/layout/AppHeader.jsx
import {
	AppBar,
	Box,
	Button,
	Container,
	Toolbar,
	Stack,
} from "@mui/material";
import Logo from "../common/Logo.jsx";

function AppHeader() {
	return (
		<AppBar
			position="static"
			elevation={0}
			sx={{ bgcolor: "transparent", color: "inherit", borderBottom: "1px solid #e5e7eb" }}
		>
			<Container maxWidth="lg">
				<Toolbar disableGutters sx={{ py: 1.5 }}>
					{/* Logo */}
					<Box sx={{ display: "flex", alignItems: "center", mr: 4 }}>
						<Logo height={40} />
					</Box>

					{/* Center links */}
					<Stack
						direction="row"
						spacing={3}
						sx={{ flexGrow: 1, justifyContent: "center", display: { xs: "none", md: "flex" } }}
					>
						<Button sx={{ textTransform: "none" }} color="inherit">
							Features
						</Button>
						<Button sx={{ textTransform: "none" }} color="inherit">
							Missions
						</Button>
						<Button sx={{ textTransform: "none" }} color="inherit">
							Impact
						</Button>
					</Stack>

					{/* Right auth buttons */}
					<Stack direction="row" spacing={2}>
						<Button variant="outlined" color="inherit" sx={{ textTransform: "none" }}>
							Log in
						</Button>
						<Button
							variant="contained"
							sx={{ textTransform: "none", bgcolor: "#166534", "&:hover": { bgcolor: "#14532d" } }}
						>
							Sign up
						</Button>
					</Stack>
				</Toolbar>
			</Container>
		</AppBar>
	);
}

export default AppHeader;
