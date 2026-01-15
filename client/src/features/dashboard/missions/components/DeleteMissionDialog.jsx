// client/src/features/dashboard/missions/components/DeleteMissionDialog.jsx
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
} from "@mui/material";

export default function DeleteMissionDialog({
	open,
	deleting,
	missionTitle,
	onClose,
	onConfirm,
}) {
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
			<DialogTitle>Delete mission?</DialogTitle>
			<DialogContent>
				<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
					This will permanently delete <b>{missionTitle || "this mission"}</b>.
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={deleting} sx={{ textTransform: "none" }}>
					Cancel
				</Button>
				<Button
					onClick={onConfirm}
					disabled={deleting}
					variant="contained"
					color="error"
					sx={{ textTransform: "none" }}
				>
					{deleting ? "Deleting..." : "Delete"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
