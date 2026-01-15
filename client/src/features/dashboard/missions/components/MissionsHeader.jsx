// client/src/features/dashboard/missions/components/MissionsHeader.jsx
import { Button, Stack, Typography } from "@mui/material";

export default function MissionsHeader({ isAdmin, onCreate }) {
	return (
		<>
			<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
				<Typography variant="h4" sx={{ fontWeight: 600 }}>
					{isAdmin ? "Missions (Admin)" : "My missions"}
				</Typography>

				{isAdmin && (
					<Button
						variant="contained"
						onClick={onCreate}
						sx={{ textTransform: "none", bgcolor: "#166534", "&:hover": { bgcolor: "#14532d" } }}
					>
						Create mission
					</Button>
				)}
			</Stack>

			<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
				{isAdmin
					? "View all missions, toggle publish status, and edit mission details."
					: "Pick a mission, complete it, and watch your eco points grow."}
			</Typography>
		</>
	);
}
