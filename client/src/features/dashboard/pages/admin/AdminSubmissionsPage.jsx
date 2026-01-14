// src/features/dashboard/pages/admin/AdminSubmissionsPage.jsx
import { useEffect, useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Typography,
	Stack,
	ToggleButton,
	ToggleButtonGroup,
	Button,
	CircularProgress,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useSnackbar } from "../../../../app/providers/SnackBarProvider.jsx";
import { useUser } from "../../../../app/providers/UserProvider.jsx";

import useAdminSubmissions from "./hooks/useAdminSubmissions.js";

import SubmissionsMobileList from "./components/SubmissionsMobileList.jsx";
import SubmissionsTable from "./components/SubmissionsTable.jsx";
import SubmissionViewDialog from "./components/SubmissionViewDialog.jsx";
import SubmissionRejectDialog from "./components/SubmissionRejectDialog.jsx";

export default function AdminSubmissionsPage() {
	const { user } = useUser();
	const navigate = useNavigate();
	const { showSuccess, showError } = useSnackbar();

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	// Guard: non-admins go back to dashboard
	useEffect(() => {
		if (user && !user.isAdmin) navigate("/dashboard");
	}, [user, navigate]);

	// Data + actions
	const { status, setStatus, rows, loading, actingId, load, approve, reject } =
		useAdminSubmissions({ showSuccess, showError });

	// Reject dialog state
	const [rejectOpen, setRejectOpen] = useState(false);
	const [rejectId, setRejectId] = useState(null);
	const [rejectReason, setRejectReason] = useState("");

	// View dialog state
	const [viewOpen, setViewOpen] = useState(false);
	const [viewTarget, setViewTarget] = useState(null);

	const openView = (sub) => {
		setViewTarget(sub);
		setViewOpen(true);
	};
	const closeView = () => {
		setViewOpen(false);
		setViewTarget(null);
	};

	const openReject = (id) => {
		setRejectId(id);
		setRejectReason("");
		setRejectOpen(true);
	};
	const closeReject = () => {
		setRejectOpen(false);
		setRejectId(null);
		setRejectReason("");
	};

	const handleReject = async () => {
		if (!rejectId) return;

		// Note: If your hook swallows errors internally, this will still close the dialog.
		// If you want the dialog to stay open on error (like the original),
		// make the hook rethrow after showError (or return a boolean).
		try {
			await reject(rejectId, rejectReason);
			closeReject();
		} catch {
			// keep dialog open if hook rethrows
		}
	};

	return (
		<Box
			sx={{
				position: "relative",
				p: { xs: 2, md: 3 },
				maxWidth: 1200,
				"&:before": {
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					borderRadius: 2,
					height: { xs: 180, md: 220 },
					background: `linear-gradient(
						180deg,
						${theme.palette.tones?.blue?.bg ?? "rgba(59,130,246,0.12)"} 0%,
						${theme.palette.tones?.green?.bg ?? "rgba(22,101,52,0.10)"} 45%,
						transparent 85%
					)`,
					maskImage:
						"linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
					WebkitMaskImage:
						"linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
					pointerEvents: "none",
					zIndex: 0,
				},
				"& > *": { position: "relative", zIndex: 1 },
			}}
		>
			<Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
				Moderation
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
				Review mission submissions and approve or reject them.
			</Typography>

			<Stack
				direction={{ xs: "column", sm: "row" }}
				spacing={1.25}
				sx={{ mb: 2 }}
				alignItems={{ xs: "stretch", sm: "center" }}
			>
				<ToggleButtonGroup
					value={status}
					exclusive
					onChange={(_e, v) => v && setStatus(v)}
					size="small"
					sx={{ alignSelf: { xs: "flex-start", sm: "auto" } }}
				>
					<ToggleButton value="pending">Pending</ToggleButton>
					<ToggleButton value="approved">Approved</ToggleButton>
					<ToggleButton value="rejected">Rejected</ToggleButton>
				</ToggleButtonGroup>

				<Button
					variant="outlined"
					size="small"
					onClick={load}
					sx={{ textTransform: "none", alignSelf: { xs: "flex-start", sm: "auto" } }}
				>
					Refresh
				</Button>
			</Stack>

			<Card sx={{ borderRadius: 2 }}>
				<CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
					{loading ? (
						<Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
							<CircularProgress />
						</Box>
					) : rows.length === 0 ? (
						<Typography color="text.secondary">
							No submissions found for this status.
						</Typography>
					) : isMobile ? (
						<SubmissionsMobileList
							rows={rows}
							status={status}
							actingId={actingId}
							onApprove={approve}
							onReject={openReject}
							onView={openView}
						/>
					) : (
						<SubmissionsTable
							rows={rows}
							status={status}
							actingId={actingId}
							onApprove={approve}
							onReject={openReject}
							onView={openView}
						/>
					)}
				</CardContent>
			</Card>

			<SubmissionViewDialog open={viewOpen} onClose={closeView} submission={viewTarget} />

			<SubmissionRejectDialog
				open={rejectOpen}
				onClose={closeReject}
				reason={rejectReason}
				onReasonChange={setRejectReason}
				onConfirm={handleReject}
				loading={actingId === rejectId}
			/>
		</Box>
	);
}
