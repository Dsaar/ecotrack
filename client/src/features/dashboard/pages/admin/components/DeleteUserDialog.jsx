// src/features/dashboard/pages/admin/components/DeleteUserDialog.jsx
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

export default function DeleteUserDialog({ open, onClose, onConfirm, deleting, targetEmail }) {
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
			<DialogTitle>Delete user?</DialogTitle>
			<DialogContent>
				<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
					This will permanently delete <b>{targetEmail}</b>.
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
