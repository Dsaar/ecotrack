import { useEffect, useState } from "react";
import {
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	Divider,
	Stack,
	Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
	getMissionById,
	completeMission,
} from "../../../services/missionsService.js";

function StatChip({ label, value, unit }) {
	if (value == null) return null;

	return (
		<Box
			sx={{
				px: 2,
				py: 1,
				borderRadius: 999,
				bgcolor: "background.paper",
				border: "1px solid",
				borderColor: "divider",
				minWidth: 0,
			}}
		>
			<Typography variant="caption" color="text.secondary">
				{label}
			</Typography>
			<Typography variant="body2" sx={{ fontWeight: 600 }}>
				{value} {unit}
			</Typography>
		</Box>
	);
}

function DashboardMissionDetails() {
	const { id } = useParams(); // /dashboard/missions/:id
	const navigate = useNavigate();

	const [mission, setMission] = useState(null);
	const [loading, setLoading] = useState(true);
	const [completing, setCompleting] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

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

	const handleComplete = async () => {
		if (!mission) return;

		try {
			setCompleting(true);
			setError("");
			setSuccessMessage("");

			await completeMission(mission._id);

			setSuccessMessage("Mission marked as completed! 🎉");
			// later we can also refetch user progress / dashboard data here
		} catch (err) {
			console.error("Failed to complete mission:", err);
			setError("Could not complete this mission. Please try again.");
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
				<Button
					variant="outlined"
					onClick={() => navigate("/dashboard/missions")}
				>
					Back to missions
				</Button>
			</Box>
		);
	}

	const { title, summary, description, category, difficulty, estImpact } =
		mission;

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
			{/* Top breadcrumb / heading */}
			<Box>
				<Button
					size="small"
					sx={{ textTransform: "none", mb: 1 }}
					onClick={() => navigate("/dashboard/missions")}
				>
					← Back to missions
				</Button>
				<Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
					{title}
				</Typography>
				<Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap">
					{category && (
						<Chip
							size="small"
							label={category}
							variant="outlined"
							color="default"
						/>
					)}
					{difficulty && (
						<Chip
							size="small"
							label={difficulty}
							color={
								difficulty === "Easy"
									? "success"
									: difficulty === "Hard"
										? "error"
										: "warning"
							}
							variant="outlined"
						/>
					)}
				</Stack>
				{summary && (
					<Typography variant="body2" color="text.secondary">
						{summary}
					</Typography>
				)}
			</Box>

			<Stack
				direction={{ xs: "column", md: "row" }}
				spacing={3}
				alignItems="flex-start"
			>
				{/* Left: description */}
				<Card
					elevation={0}
					sx={{
						flex: 2,
						borderRadius: 3,
						border: "1px solid",
						borderColor: "divider",
						bgcolor: "background.paper",
					}}
				>
					<CardContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
						{/* Placeholder for future image */}
						<Box
							sx={{
								mb: 1,
								width: "100%",
								borderRadius: 2,
								bgcolor: "grey.900",
								minHeight: 120,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "grey.100",
								fontSize: 14,
								bgcolor: "action.hover",
							}}
						>
							{/* Later we can replace this box with mission.image preview */}
							Mission visual will go here
						</Box>

						<Typography variant="h6" sx={{ fontWeight: 600 }}>
							What you’ll do
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
							{description || "No description provided for this mission yet."}
						</Typography>
					</CardContent>
				</Card>

				{/* Right: stats + action */}
				<Stack
					spacing={2}
					sx={{
						flex: 1,
						minWidth: { xs: "100%", md: 280 },
					}}
				>
					<Card
						elevation={0}
						sx={{
							borderRadius: 3,
							border: "1px solid",
							borderColor: "divider",
							bgcolor: "background.paper",
						}}
					>
						<CardContent sx={{ p: 3 }}>
							<Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
								Estimated impact
							</Typography>

							<Stack direction="column" spacing={1.5}>
								<StatChip
									label="CO₂ reduction"
									value={estImpact?.co2Kg}
									unit="kg"
								/>
								<StatChip
									label="Water saved"
									value={estImpact?.waterL}
									unit="L"
								/>
								<StatChip
									label="Waste diverted"
									value={estImpact?.wasteKg}
									unit="kg"
								/>
							</Stack>

							<Divider sx={{ my: 2 }} />

							{successMessage && (
								<Typography
									variant="body2"
									sx={{ mb: 1, color: "success.main", fontWeight: 500 }}
								>
									{successMessage}
								</Typography>
							)}
							{error && (
								<Typography
									variant="body2"
									sx={{ mb: 1, color: "error.main", fontWeight: 500 }}
								>
									{error}
								</Typography>
							)}

							<Stack direction="column" spacing={1.5}>
								<Button
									variant="contained"
									fullWidth
									sx={{
										textTransform: "none",
										bgcolor: "#166534",
										"&:hover": { bgcolor: "#14532d" },
									}}
									onClick={handleComplete}
									disabled={completing}
								>
									{completing ? "Marking as completed..." : "Mark as completed"}
								</Button>
								{/* Optional: secondary button for future features */}
								<Button
									variant="text"
									fullWidth
									sx={{ textTransform: "none" }}
									onClick={() => navigate("/dashboard")}
								>
									View my impact →
								</Button>
							</Stack>
						</CardContent>
					</Card>
				</Stack>
			</Stack>
		</Box>
	);
}

export default DashboardMissionDetails;
