// src/features/dashboard/layout/DashboardLayout.jsx
import { Box } from "@mui/material";
import Sidebar from "../layout/Sidebar.jsx";
import TopBar from "../layout/TopBar.jsx";
import { CommunityProvider } from "../../../app/providers/CommunityProvider.jsx";

function DashboardLayout({ children }) {
	return (
		<CommunityProvider>
			<Box
				sx={{
					display: "flex",
					minHeight: "100vh",
					bgcolor: "background.default",
				}}
			>
				<Sidebar />
				<Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
					<TopBar />
					<Box
						component="main"
						sx={{
							flex: 1,
							px: { xs: 2, md: 3 },
							py: { xs: 2, md: 3 },
							bgcolor: "background.default",
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
