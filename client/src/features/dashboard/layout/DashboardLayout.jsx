// src/features/dashboard/layout/DashboardLayout.jsx
import { Box, Drawer } from "@mui/material";
import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import TopBar from "./TopBar.jsx";

// ✅ bring back community context
import { CommunityProvider } from "../../../app/providers/CommunityProvider.jsx";

function DashboardLayout({ children }) {
	const [mobileOpen, setMobileOpen] = useState(false);

	const toggleMobileSidebar = () => setMobileOpen((prev) => !prev);
	const closeMobileSidebar = () => setMobileOpen(false);

	return (
		<CommunityProvider>
			<Box
				sx={{
					display: "flex",
					minHeight: "100vh",
					bgcolor: "background.default",
				}}
			>
				{/* ✅ Desktop sidebar */}
				<Sidebar />

				{/* ✅ Mobile sidebar drawer */}
				<Drawer
					open={mobileOpen}
					onClose={closeMobileSidebar}
					variant="temporary"
					keepMounted
					sx={{
						display: { xs: "block", md: "none" },
						"& .MuiDrawer-paper": { width: 260 },
					}}
				>
					<Sidebar mobile onNavigate={closeMobileSidebar} />
				</Drawer>

				<Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
					<TopBar onToggleSidebar={toggleMobileSidebar} />

					<Box
						component="main"
						sx={{
							flex: 1,
							width: "100%",
							overflowX: "hidden",
							px: { xs: 2, md: 3 },
							py: { xs: 2, md: 3 },
						}}
					>
						{children}
					</Box>
				</Box>
			</Box>
		</CommunityProvider>
	);
}

export default DashboardLayout;
