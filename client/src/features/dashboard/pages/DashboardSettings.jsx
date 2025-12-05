// src/features/dashboard/pages/DashboardSettings.jsx
import {
	Box,
	Card,
	CardContent,
	FormControlLabel,
	Switch,
	Typography,
} from "@mui/material";
import { useThemeMode } from "../../../app/providers/CustomThemeProvider.jsx";

function DashboardSettings() {
	const { mode, toggleColorMode } = useThemeMode();

	const isDark = mode === "dark";

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
			<Typography variant="h5" sx={{ fontWeight: 600 }}>
				Settings
			</Typography>

			<Card
				elevation={0}
				sx={{
					borderRadius: 3,
					border: "1px solid #e5e7eb",
					bgcolor: "background.paper",
				}}
			>
				<CardContent>
					<Typography variant="h6" sx={{ mb: 1.5 }}>
						Appearance
					</Typography>
					<FormControlLabel
						control={
							<Switch
								checked={isDark}
								onChange={toggleColorMode}
								color="primary"
							/>
						}
						label={isDark ? "Dark mode" : "Light mode"}
					/>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
						Toggle between light and dark themes for EcoTrack.
					</Typography>
				</CardContent>
			</Card>
		</Box>
	);
}

export default DashboardSettings;
