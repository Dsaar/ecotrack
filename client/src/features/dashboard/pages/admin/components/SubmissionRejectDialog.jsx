// src/features/dashboard/pages/admin/components/SubmissionRejectDialog.jsx
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";

export default function SubmissionRejectDialog({
	open,
	onClose,
	reason,
	onReasonChange,
	onConfirm,
	loading,
}) {
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>Reject submission</DialogTitle>
			<DialogContent>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
					Add an optional reason. (Saved as <code>rejectionReason</code>.)
				</Typography>
				<TextField
					label="Reason (optional)"
					value={reason}
					onChange={(e) => onReasonChange(e.target.value)}
					fullWidth
					multiline
					minRows={3}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} sx={{ textTransform: "none" }}>
					Cancel
				</Button>
				<Button
					onClick={onConfirm}
					color="error"
					variant="contained"
					sx={{ textTransform: "none" }}
					disabled={loading}
				>
					{loading ? "Rejecting..." : "Reject"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
