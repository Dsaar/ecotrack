// src/features/landing/pages/HomePage.jsx
import { useEffect, useMemo, useState } from "react";
import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	LinearProgress,
	Stack,
	Typography,
	CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// ✅ make sure you have this service function (see below)
import { getCommunityOverviewPublic } from "../../../services/communityService.js";

function HomePage() {
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [communityStats, setCommunityStats] = useState(null);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			try {
				setLoading(true);
				setError("");

				const data = await getCommunityOverviewPublic();

				// Expecting: { communityStats: {...}, ... }
				if (!cancelled) setCommunityStats(data?.communityStats || null);
			} catch (err) {
				console.error("[HomePage] failed to load community overview", err);
				if (!cancelled)
					setError(
						err?.response?.data?.message ||
						"Failed to load community impact. Please try again."
					);
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, []);

	const co2SavedKg = Number(communityStats?.co2SavedKg || 0);
	const waterSavedL = Number(communityStats?.waterSavedL || 0);
	const totalEcoPoints = Number(communityStats?.totalEcoPoints || 0);
	const goalPointsTarget = Number(communityStats?.goalPointsTarget || 20000);

	const progressPct = useMemo(() => {
		if (!goalPointsTarget) return 0;
		const pct = (totalEcoPoints / goalPointsTarget) * 100;
		return Math.max(0, Math.min(100, pct));
	}, [totalEcoPoints, goalPointsTarget]);

	return (
		<Box
			sx={{
				minHeight: "calc(100vh - 300px)",
				bgcolor: "background.default",
				display: "flex",
				alignItems: "center",
			}}
		>
			<Container maxWidth="lg">
				<Stack
					direction={{ xs: "column", md: "row" }}
					spacing={{ xs: 6, md: 8 }}
					alignItems="center"
				>
					{/* Left: Hero text */}
					<Box sx={{ flex: 1 }}>
						<Typography
							component="h1"
							variant="h3"
							sx={{ fontWeight: 700, letterSpacing: -0.5, mb: 2 }}
						>
							See your impact.
							<br />
							One mission at a time.
						</Typography>

						<Typography
							variant="body1"
							color="text.secondary"
							sx={{ maxWidth: 480, mb: 3 }}
						>
							Take on eco-friendly missions, track your progress, and make a
							difference for the planet.
						</Typography>

						<Stack direction="row" spacing={2}>
							<Button
								variant="contained"
								sx={{
									textTransform: "none",
									px: 3.5,
									py: 1.2,
									bgcolor: "#166534",
									"&:hover": { bgcolor: "#14532d" },
								}}
								onClick={() => navigate("/register")}
							>
								Get Started
							</Button>
							<Button
								variant="text"
								sx={{ textTransform: "none" }}
								onClick={() => navigate("/missions")}
							>
								Browse missions →
							</Button>
						</Stack>
					</Box>

					{/* Right: Community impact card */}
					<Box sx={{ flex: 1, width: "100%" }}>
						<Card
							elevation={0}
							sx={{
								borderRadius: 4,
								border: "1px solid",
								borderColor: "divider",
								bgcolor: "background.paper",
							}}
						>
							<CardContent sx={{ p: 4 }}>
								<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
									Community impact
								</Typography>

								{loading ? (
									<Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
										<CircularProgress size={28} />
									</Box>
								) : error ? (
									<Typography color="error" variant="body2">
										{error}
									</Typography>
								) : (
									<>
										<Stack
											direction={{ xs: "column", sm: "row" }}
											spacing={2}
											sx={{ mb: 3 }}
										>
											<Box
												sx={{
													flex: 1,
													p: 2,
													borderRadius: 3,
													bgcolor: "success.light",
													color: "success.contrastText",
												}}
											>
												<Typography variant="caption">CO₂ Reduced</Typography>
												<Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
													{Math.round(co2SavedKg)} kg
												</Typography>
											</Box>

											<Box
												sx={{
													flex: 1,
													p: 2,
													borderRadius: 3,
													bgcolor: "info.light",
													color: "info.contrastText",
												}}
											>
												<Typography variant="caption">Water Saved</Typography>
												<Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
													{Math.round(waterSavedL)} liters
												</Typography>
											</Box>
										</Stack>

										<Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
											Community Missions Progress
										</Typography>

										<LinearProgress
											variant="determinate"
											value={progressPct}
											sx={{ height: 8, borderRadius: 999, mb: 1 }}
										/>

										<Typography variant="body2" color="text.secondary">
											{Math.round(progressPct)}% toward our goal ({totalEcoPoints.toLocaleString()} /{" "}
											{goalPointsTarget.toLocaleString()} eco points)
										</Typography>
									</>
								)}

								<Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
									Sign in to see your personal impact.
								</Typography>
							</CardContent>
						</Card>
					</Box>
				</Stack>
			</Container>
		</Box>
	);
}

export default HomePage;
