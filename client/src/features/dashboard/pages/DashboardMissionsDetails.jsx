// src/features/dashboard/pages/DashboardMissionsDetails.jsx
import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
	getMissionById,
	completeMission,
} from "../../../services/missionsService.js";
import { useSnackbar } from "../../../app/providers/SnackBarProvider.jsx";

import MissionHeader from "../components/MissionHeader.jsx";
import MissionDescriptionCard from "../components/MissionDescriptionCard.jsx";
import MissionImpactPanel from "../components/MissionImpactPanel.jsx";

function DashboardMissionDetails() {
	const { id } = useParams(); // /dashboard/missions/:id
	const navigate = useNavigate();
	const { showSuccess, showError } = useSnackbar();

	const [mission, setMission] = useState(null);
	const [loading, setLoading] = useState(true);
	const [completing, setCompleting] = useState(false);
	const [error, setError] = useState("");

	// Load mission
	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			try {
				setLoading(true);
				setError("");
				const data = await getMissionById(id);
				if (!cancelled) {
					setMission(data);
				}
			} catch (err) {
				console.error("Failed to load mission:", err);
				if (!cancelled) {
					setError("Could not load this mission. Please try again.");
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		load();
		return () => {
			cancelled = true;
		};
	}, [id]);

	const handleBack = () => {
		navigate("/dashboard/missions");
	};

	const handleViewImpact = () => {
		navigate("/dashboard");
	};

	const handleComplete = async () => {
		if (!mission?._id) return;
		setError("");
		setCompleting(true);

		try {
			await completeMission(mission._id);
			showSuccess("Mission submitted for review!");
			// later: refetch mission / submissions if needed
		} catch (err) {
			const status = err.response?.status;
			const apiMessage = err.response?.data?.message;

			if (status === 409) {
				const msg =
					apiMessage ||
					"You already have a pending submission for this mission.";
				setError(msg);
				showError(msg);
			} else {
				console.error("Failed to complete mission:", err);
				const msg =
					apiMessage ||
					"Could not submit this mission right now. Please try again.";
				setError(msg);
				showError(msg);
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

	const { title, summary, description, category, difficulty, estImpact } =
		mission;

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
			<MissionHeader
				title={title}
				summary={summary}
				category={category}
				difficulty={difficulty}
				onBack={handleBack}
			/>

			<Stack
				direction={{ xs: "column", md: "row" }}
				spacing={3}
				alignItems="flex-start"
			>
				<MissionDescriptionCard description={description} />

				<MissionImpactPanel
					estImpact={estImpact}
					error={error}
					completing={completing}
					onComplete={handleComplete}
					onViewImpact={handleViewImpact}
				/>
			</Stack>
		</Box>
	);
}

export default DashboardMissionDetails;
