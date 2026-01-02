// src/features/dashboard/layout/Sidebar.jsx
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
import GroupsIcon from "@mui/icons-material/Groups";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GavelIcon from "@mui/icons-material/Gavel";
import PeopleIcon from "@mui/icons-material/People";
import ChatIcon from "@mui/icons-material/Chat";

import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../../components/common/Logo.jsx";
import { useUser } from "../../../app/providers/UserProvider.jsx";

function Sidebar({ mobile = false, onNavigate }) {
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useUser();

	const items = [
		{ label: "Overview", icon: <DashboardIcon />, path: "/dashboard" },
		{ label: "Community", icon: <GroupsIcon />, path: "/dashboard/community" },
		{ label: "Missions", icon: <AssignmentIcon />, path: "/dashboard/missions" },
		{ label: "Favorites", icon: <FavoriteIcon />, path: "/dashboard/favorites" },
		{ label: "Activity", icon: <ShowChartIcon />, path: "/dashboard/activity" },
		{ label: "Chat", icon: <ChatIcon />, path: "/dashboard/chat" },
		{ label: "Profile", icon: <PersonIcon />, path: "/dashboard/profile" },
	];

	const isActive = (path) => location.pathname === path;

	const go = (path) => {
		navigate(path);
		onNavigate?.(); // ✅ close drawer if we're in mobile drawer mode
	};

	return (
		<Box
			component="aside"
			sx={{
				width: 260,
				borderRight: mobile ? "none" : "1px solid",
				borderColor: "divider",
				bgcolor: "background.paper",
				display: mobile ? "flex" : { xs: "none", md: "flex" },
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
				{items.map((item) => {
					const active = isActive(item.path);

					return (
						<ListItemButton
							key={item.label}
							onClick={() => go(item.path)}
							selected={active}
							sx={{
								borderRadius: 2,
								mb: 0.5,
								"&:hover": { bgcolor: "action.hover" },
							}}
						>
							<ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
							<ListItemText
								primary={item.label}
								primaryTypographyProps={{ fontSize: 14 }}
							/>
						</ListItemButton>
					);
				})}
			</List>

			{/* Admin section */}
			{user?.isAdmin && (
				<>
					<Typography
						variant="overline"
						sx={{
							color: "text.secondary",
							fontSize: 11,
							letterSpacing: 1,
							px: 1,
							mt: 3,
							mb: 1,
						}}
					>
						Admin
					</Typography>

					<List>
						<ListItemButton
							onClick={() => go("/dashboard/admin/submissions")}
							selected={location.pathname.startsWith("/dashboard/admin/submissions")}
							sx={{
								borderRadius: 2,
								mb: 0.5,
								"&:hover": { bgcolor: "action.hover" },
							}}
						>
							<ListItemIcon sx={{ minWidth: 32 }}>
								<GavelIcon />
							</ListItemIcon>
							<ListItemText
								primary="Moderation"
								primaryTypographyProps={{ fontSize: 14 }}
							/>
						</ListItemButton>

						<ListItemButton
							onClick={() => go("/dashboard/admin/users")}
							selected={location.pathname.startsWith("/dashboard/admin/users")}
							sx={{
								borderRadius: 2,
								mb: 0.5,
								"&:hover": { bgcolor: "action.hover" },
							}}
						>
							<ListItemIcon sx={{ minWidth: 32 }}>
								<PeopleIcon />
							</ListItemIcon>
							<ListItemText
								primary="Users"
								primaryTypographyProps={{ fontSize: 14 }}
							/>
						</ListItemButton>
					</List>
				</>
			)}
		</Box>
	);
}

export default Sidebar;
