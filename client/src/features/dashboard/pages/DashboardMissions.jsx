// src/features/dashboard/pages/DashboardMissions.jsx
import { useEffect, useState, useCallback } from "react";
import {
	Box,
	Card,
	CardContent,
	Typography,
	Grid,
	Button,
	Stack,
	Chip,
	IconButton,
	Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import FavoriteButton from "../../missions/components/FavoriteButton.jsx";
import { useUser } from "../../../app/providers/UserProvider.jsx";
import { useSnackbar } from "../../../app/providers/SnackBarProvider.jsx";

import {
	getMissions,
	getMissionsAdmin,
	patchMission,
} from "../../../services/missionsService.js";

import PublicIcon from "@mui/icons-material/Public";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function DashboardMissions() {
	const [missions, setMissions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const navigate = useNavigate();
	const { user } = useUser();
	const { showSuccess, showError } = useSnackbar();

	const isAdmin = !!user?.isAdmin;

	const loadMissions = useCallback(async () => {
		try {
			setLoading(true);
			setError("");

			const data = isAdmin ? await getMissionsAdmin() : await getMissions();

			// your API returns an array, but keep your fallback just in case
			const items = Array.isArray(data) ? data : data?.missions || [];
			setMissions(items);
		} catch (err) {
			console.error("Failed to load dashboard missions:", err);
			setError(err?.response?.data?.message || "Could not load missions. Please try again.");
			showError?.(err?.response?.data?.message || "Could not load missions.");
		} finally {
			setLoading(false);
		}
	}, [isAdmin, showError]);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			try {
				setLoading(true);
				setError("");

				const data = isAdmin ? await getMissionsAdmin() : await getMissions();
				if (!cancelled) {
					const items = Array.isArray(data) ? data : data?.missions || [];
					setMissions(items);
				}
			} catch (err) {
				console.error("Failed to load dashboard missions:", err);
				if (!cancelled) {
					setError(err?.response?.data?.message || "Could not load missions. Please try again.");
					showError?.(err?.response?.data?.message || "Could not load missions.");
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [isAdmin, showError]);

	const handleTogglePublish = async (e, mission) => {
		e.stopPropagation(); // don’t trigger card navigation

		try {
			const next = !mission.isPublished;

			// optimistic UI
			setMissions((prev) =>
				prev.map((m) => (m._id === mission._id ? { ...m, isPublished: next } : m))
			);

			await patchMission(mission._id, { isPublished: next });

			showSuccess?.(next ? "Mission published." : "Mission unpublished.");
		} catch (err) {
			console.error("Toggle publish failed:", err);

			// rollback
			setMissions((prev) =>
				prev.map((m) =>
					m._id === mission._id ? { ...m, isPublished: mission.isPublished } : m
				)
			);

			showError?.(err?.response?.data?.message || "Failed to update publish status.");
		}
	};

	if (loading) {
		return (
			<Box sx={{ p: { xs: 2, md: 3 } }}>
				<Typography variant="body2" color="text.secondary">
					Loading missions...
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ p: { xs: 2, md: 3 } }}>
			<Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
				{isAdmin ? "Missions (Admin)" : "My missions"}
			</Typography>

			<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
				{isAdmin
					? "View all missions and toggle publish status."
					: "Pick a mission, complete it, and watch your eco points grow."}
			</Typography>

			{error && (
				<Typography color="error" sx={{ mb: 2 }}>
					{error}
				</Typography>
			)}

			{missions.length === 0 ? (
				<Typography variant="body2" color="text.secondary">
					No missions found.
				</Typography>
			) : (
				<Grid container spacing={2}>
					{missions.map((mission) => (
						<Grid item xs={12} sm={6} md={4} key={mission._id}>
							<Card
								variant="outlined"
								onClick={() => navigate(`/dashboard/missions/${mission._id}`)}
								sx={{
									height: "100%",
									display: "flex",
									flexDirection: "column",
									cursor: "pointer",
									"&:hover": { boxShadow: 3 },
								}}
							>
								{/* ✅ mission image */}
								<Box
									sx={{
										height: 140,
										bgcolor: "action.hover",
										backgroundImage: mission.imageUrl ? `url(${mission.imageUrl})` : "none",
										backgroundSize: "cover",
										backgroundPosition: "center",
									}}
								/>

								<CardContent sx={{ flexGrow: 1 }}>
									<Stack
										direction="row"
										justifyContent="space-between"
										alignItems="flex-start"
										sx={{ mb: 1 }}
										spacing={1}
									>
										<Typography variant="subtitle1" sx={{ fontWeight: 600, pr: 1 }}>
											{mission.title}
										</Typography>

										<Stack direction="row" spacing={0.5} alignItems="center">
											{/* ⭐ Favorites */}
											<FavoriteButton missionId={mission._id} />

											{/* ✅ Admin publish toggle */}
											{isAdmin && (
												<Tooltip
													title={
														mission.isPublished
															? "Unpublish (hide from public)"
															: "Publish (show on public)"
													}
												>
													<IconButton
														size="small"
														onClick={(e) => handleTogglePublish(e, mission)}
													>
														{mission.isPublished ? (
															<VisibilityOffIcon fontSize="small" />
														) : (
															<PublicIcon fontSize="small" />
														)}
													</IconButton>
												</Tooltip>
											)}
										</Stack>
									</Stack>

									<Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap">
										{mission.category && (
											<Chip size="small" label={mission.category} variant="outlined" />
										)}

										{mission.difficulty && (
											<Chip
												size="small"
												label={mission.difficulty}
												variant="outlined"
												color={
													mission.difficulty === "Easy"
														? "success"
														: mission.difficulty === "Hard"
															? "error"
															: "warning"
												}
											/>
										)}

										{/* ✅ Admin: unpublished indicator */}
										{isAdmin && mission.isPublished === false && (
											<Chip
												size="small"
												label="Unpublished"
												variant="outlined"
												color="warning"
											/>
										)}
									</Stack>

									<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
										{mission.summary}
									</Typography>
								</CardContent>

								<Box sx={{ p: 2, pt: 0 }}>
									<Button
										size="small"
										variant="contained"
										onClick={(e) => {
											e.stopPropagation();
											navigate(`/dashboard/missions/${mission._id}`);
										}}
										sx={{
											textTransform: "none",
											bgcolor: "#166534",
											"&:hover": { bgcolor: "#14532d" },
										}}
									>
										View details
									</Button>
								</Box>
							</Card>
						</Grid>
					))}
				</Grid>
			)}
		</Box>
	);
}

export default DashboardMissions;
