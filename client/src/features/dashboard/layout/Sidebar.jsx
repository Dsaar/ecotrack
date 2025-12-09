import {
	Box,
	List,
	ListItemButton,
	ListItemText,
	ListItemIcon,
	Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../../components/common/Logo.jsx";
import GroupsIcon from "@mui/icons-material/Groups";


function Sidebar() {
	const navigate = useNavigate();
	const location = useLocation();
	const items = [
		{ label: "Overview", icon: <DashboardIcon />, path: "/dashboard" },
		{ label: "Community", icon: <GroupsIcon />, path: "/dashboard/community" },
		{ label: "Missions", icon: <AssignmentIcon />, path: "/dashboard/missions" },
		{ label: "Activity", icon: <ShowChartIcon />, path: "/dashboard/activity" },
		{ label: "Profile", icon: <PersonIcon />, path: "/dashboard/profile" },
	];


	const isActive = (path) => location.pathname === path;

	return (
		<Box
			component="aside"
			sx={{
				width: 260,
				borderRight: "1px solid",
				borderColor: "divider",
				bgcolor: "background.paper",
				display: { xs: "none", md: "flex" },
				flexDirection: "column",
				p: 2,
			}}
		>
			{/* Logo */}
			<Box sx={{ mb: 3, px: 1, display: "flex", alignItems: "center", gap: 1 }}>
				<Logo height={36} />
			</Box>

			<Typography
				variant="overline"
				sx={{
					color: "text.secondary",
					fontSize: 11,
					letterSpacing: 1,
					px: 1,
					mb: 1,
				}}
			>
				Dashboard
			</Typography>

			<List>
				{items.map((item) => (
					<ListItemButton
						key={item.label}
						onClick={() => navigate(item.path)}
						sx={{
							borderRadius: 2,
							mb: 0.5,
							"&:hover": {
								bgcolor: "action.hover",
							},
						}}
					>
						<ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
						<ListItemText
							primary={item.label}
							primaryTypographyProps={{ fontSize: 14 }}
						/>
					</ListItemButton>
				))}
			</List>
		</Box>
	);
}

export default Sidebar;
