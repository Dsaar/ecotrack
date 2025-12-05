import { Box } from "@mui/material";
import Sidebar from "./Sidebar.jsx";
import TopBar from "./TopBar.jsx";

function DashboardLayout({ children }) {
	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				bgcolor: "background.default",
			}}
		>
			<Sidebar />

			<Box
				sx={{
					flexGrow: 1,
					display: "flex",
					flexDirection: "column",
				}}
			>
				<TopBar />
				<Box
					component="main"
					sx={{
						flexGrow: 1,
						p: { xs: 2, md: 3 },
					}}
				>
					{children}
				</Box>
			</Box>
		</Box>
	);
}

export default DashboardLayout;
