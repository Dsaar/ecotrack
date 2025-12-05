// src/features/dashboard/pages/DashboardMissions.jsx
import { useEffect, useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	Grid,
	Typography,
	Stack,
	Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getMissions } from "../../../services/missionsService.js";

function MissionCard({ mission }) {
	const navigate = useNavigate();

	return (
		<Card
			elevation={0}
			sx={{
				borderRadius: 3,
				border: "1px solid",
				borderColor: "divider",
				bgcolor: "background.paper",
				height: "100%",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
				<Typography variant="subtitle2" color="text.secondary">
					{mission.category || "General"}
				</Typography>
				<Typography variant="h6" sx={{ fontWeight: 600 }}>
					{mission.title}
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{
						display: "-webkit-box",
						WebkitLineClamp: 3,
						WebkitBoxOrient: "vertical",
						overflow: "hidden",
					}}
				>
					{mission.summary || mission.description}
				</Typography>

				<Stack direction="row" spacing={1} sx={{ mt: "auto" }}>
					{mission.difficulty && (
						<Chip
							size="small"
							label={mission.difficulty}
							color={
								mission.difficulty === "Easy"
									? "success"
									: mission.difficulty === "Hard"
										? "error"
										: "warning"
							}
							variant="outlined"
						/>
					)}
					{typeof mission.estimatedImpact?.co2Kg === "number" && (
						<Chip
							size="small"
							label={`~${mission.estimatedImpact.co2Kg} kg CO₂`}
							variant="outlined"
						/>
					)}
				</Stack>

				<Button
					size="small"
					sx={{ mt: 2, alignSelf: "flex-start", textTransform: "none" }}
					onClick={() => navigate(`/dashboard/missions/${mission._id}`)}
				>
					View details →
				</Button>
			</CardContent>
		</Card>
	);
}

function DashboardMissions() {
	const [missions, setMissions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			try {
				setLoading(true);
				setError("");
				const data = await getMissions();
				if (!cancelled) {
					setMissions(Array.isArray(data) ? data : data.missions || []);
				}
			} catch (err) {
				console.error("Failed to fetch missions:", err);
				if (!cancelled) {
					setError("Could not load missions. Please try again.");
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		load();

		return () => {
			cancelled = true;
		};
	}, []);

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ mt: 4 }}>
				<Typography variant="h6" sx={{ mb: 1 }}>
					Missions
				</Typography>
				<Typography color="error" variant="body2">
					{error}
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: { xs: "flex-start", sm: "center" },
					flexDirection: { xs: "column", sm: "row" },
					gap: 2,
				}}
			>
				<Box>
					<Typography variant="h5" sx={{ fontWeight: 600 }}>
						Missions
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Browse and complete missions to reduce your environmental footprint.
					</Typography>
				</Box>
				{/* later we can add filters/search here */}
			</Box>

			{missions.length === 0 ? (
				<Typography variant="body2" color="text.secondary">
					No missions found yet.
				</Typography>
			) : (
				<Grid container spacing={2}>
					{missions.map((mission) => (
						<Grid item xs={12} sm={6} md={4} key={mission._id}>
							<MissionCard mission={mission} />
						</Grid>
					))}
				</Grid>
			)}
		</Box>
	);
}

export default DashboardMissions;
