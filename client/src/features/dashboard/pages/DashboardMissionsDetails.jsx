import { useEffect, useState } from "react";
import {
	Box,
	Button,
	CircularProgress,
	Stack,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { getMissionById } from "../../../services/missionsService.js";
import { useSnackbar } from "../../../app/providers/SnackBarProvider.jsx";
import { createSubmission } from "../../../services/submissionsService.js";

import MissionSubmissionForm from "../components/MissionSubmissionForm.jsx";
import MissionHeader from "../components/MissionHeader.jsx";
import MissionImpactPanel from "../components/MissionImpactPanel.jsx";
import MissionDescriptionCard from "../components/MissionDescriptionCard.jsx";

function DashboardMissionDetails() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { showSuccess, showError } = useSnackbar();

	const [mission, setMission] = useState(null);
	const [loading, setLoading] = useState(true);
	const [completing, setCompleting] = useState(false);
	const [error, setError] = useState("");

	// ✅ modal state
	const [submitOpen, setSubmitOpen] = useState(false);

	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			try {
				setLoading(true);
				setError("");
				const data = await getMissionById(id);
				if (!cancelled) setMission(data);
			} catch (err) {
				console.error("Failed to load mission:", err);
				if (!cancelled) setError("Could not load this mission. Please try again.");
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		load();
		return () => {
			cancelled = true;
		};
	}, [id]);

	const handleBack = () => navigate("/dashboard/missions");
	const handleViewImpact = () => navigate("/dashboard");

	// ✅ open/close modal
	const openSubmitModal = () => {
		setError("");
		setSubmitOpen(true);
	};
	const closeSubmitModal = () => {
		if (completing) return;
		setSubmitOpen(false);
	};

	// ✅ called by the form INSIDE the modal
	const handleSubmitMission = async ({ answers, evidenceUrls }) => {
		if (!mission?._id) return;

		setError("");
		setCompleting(true);

		try {
			await createSubmission({
				missionId: mission._id,
				answers,
				evidenceUrls,
			});

			showSuccess?.("Mission submitted for review!");
			setSubmitOpen(false); // ✅ close modal after success
		} catch (err) {
			const status = err?.response?.status;
			const apiMessage = err?.response?.data?.message;

			if (status === 409) {
				const msg = apiMessage || "You already have a pending submission for this mission.";
				setError(msg);
				showError?.(msg);
			} else {
				const msg = apiMessage || "Could not submit this mission right now. Please try again.";
				setError(msg);
				showError?.(msg);
			}
		} finally {
			setCompleting(false);
		}
	};

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (!mission) {
		return (
			<Box>
				<Typography variant="h5" sx={{ mb: 2 }}>
					Mission not found
				</Typography>
				<Button variant="outlined" onClick={handleBack}>
					Back to missions
				</Button>
			</Box>
		);
	}

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
			<MissionHeader
				title={mission.title}
				summary={mission.summary}
				category={mission.category}
				difficulty={mission.difficulty}
				points={mission.points}
				duration={mission.duration}
				tags={mission.tags}
				onBack={handleBack}
			/>

			<Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="flex-start">
				<MissionDescriptionCard mission={mission} />

				<Stack spacing={2} sx={{ width: { xs: "100%", md: 420 } }}>
					<MissionImpactPanel
						estImpact={mission.estImpact}
						error={error}
						completing={completing}
						onViewImpact={handleViewImpact}
					/>

					{/* ✅ Mark as completed button opens modal */}
					<Button
						variant="contained"
						onClick={openSubmitModal}
						disabled={completing}
						sx={{
							textTransform: "none",
							bgcolor: "#166534",
							"&:hover": { bgcolor: "#14532d" },
						}}
					>
						Mark as completed
					</Button>

					{error && (
						<Typography variant="body2" color="error">
							{error}
						</Typography>
					)}
				</Stack>
			</Stack>

			{/* ✅ Submission modal */}
			<Dialog
				open={submitOpen}
				onClose={closeSubmitModal}
				fullWidth
				maxWidth="sm"
			>
				<DialogTitle>Submit mission</DialogTitle>

				<DialogContent dividers>
					<MissionSubmissionForm
						mission={mission}
						submitting={completing}
						onSubmit={handleSubmitMission}
					/>

					{/* Optional: show general error inside modal too */}
					{error && (
						<Typography variant="body2" color="error" sx={{ mt: 2 }}>
							{error}
						</Typography>
					)}
				</DialogContent>

				<DialogActions>
					<Button
						onClick={closeSubmitModal}
						disabled={completing}
						sx={{ textTransform: "none" }}
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

export default DashboardMissionDetails;
