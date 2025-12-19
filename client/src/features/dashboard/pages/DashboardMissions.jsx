// src/features/dashboard/pages/DashboardMissions.jsx
import { useEffect, useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Typography,
	Grid,
	Button,
	Stack,
	Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { getMissions } from "../../../services/missionsService.js";
import FavoriteButton from "../../missions/components/FavoriteButton.jsx";

function DashboardMissions() {
	const [missions, setMissions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		let cancelled = false;

		(async () => {
			try {
				setLoading(true);
				setError("");
				const data = await getMissions();
				if (!cancelled) {
					setMissions(Array.isArray(data) ? data : data.missions || []);
				}
			} catch (err) {
				console.error("Failed to load dashboard missions:", err);
				if (!cancelled) setError("Could not load missions. Please try again.");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, []);

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
				My missions
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
				Pick a mission, complete it, and watch your eco points grow.
			</Typography>

			{error && (
				<Typography color="error" sx={{ mb: 2 }}>
					{error}
				</Typography>
			)}

			<Grid container spacing={2}>
				{missions.map((mission) => (
					<Grid item xs={12} sm={6} md={4} key={mission._id}>
						<Card
							variant="outlined"
							sx={{ height: "100%", display: "flex", flexDirection: "column" }}
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
								>
									<Typography variant="subtitle1" sx={{ fontWeight: 600, pr: 1 }}>
										{mission.title}
									</Typography>

									<FavoriteButton missionId={mission._id} />
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
								</Stack>

								<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
									{mission.summary}
								</Typography>
							</CardContent>

							<Box sx={{ p: 2, pt: 0 }}>
								<Button
									size="small"
									variant="contained"
									onClick={() => navigate(`/dashboard/missions/${mission._id}`)}
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
		</Box>
	);
}

export default DashboardMissions;
