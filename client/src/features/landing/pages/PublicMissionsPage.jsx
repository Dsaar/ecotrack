// src/features/landing/pages/PublicMissionsPage.jsx
import { useEffect, useMemo, useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	Container,
	Typography,
	Stack,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getMissions } from "../../../services/missionsService.js";

const PAGE_SIZE_OPTIONS = [6, 12, 24];

function PublicMissionCard({ mission }) {
	const navigate = useNavigate();

	const CARD_H = 360;
	const IMAGE_H = 150;
	const BTN_H = 44;

	const clamp = (lines) => ({
		display: "-webkit-box",
		WebkitBoxOrient: "vertical",
		WebkitLineClamp: lines,
		overflow: "hidden",
	});

	return (
		<Card
			variant="outlined"
			sx={{
				height: CARD_H,
				width: "100%",
				display: "flex",
				flexDirection: "column",
				cursor: "pointer",
				borderRadius: 1.4,
				overflow: "hidden",
				"&:hover": { boxShadow: 3 },
			}}
			onClick={() => navigate("/login")}
		>
			<Box
				sx={{
					height: IMAGE_H,
					width: "100%",
					bgcolor: "action.hover",
					backgroundImage: mission.imageUrl ? `url(${mission.imageUrl})` : "none",
					backgroundSize: "cover",
					backgroundPosition: "center",
					flexShrink: 0,
				}}
			/>

			<CardContent
				sx={{
					flex: 1,
					minHeight: 0,
					display: "flex",
					flexDirection: "column",
					p: 2,
					gap: 1,
				}}
			>
				<Typography
					variant="subtitle1"
					sx={{
						fontWeight: 700,
						lineHeight: 1.2,
						...clamp(2),
						minHeight: 42,
					}}
				>
					{mission.title || "Untitled mission"}
				</Typography>

				<Box sx={{ minHeight: 34, display: "flex", alignItems: "center" }}>
					<Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
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
				</Box>

				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ ...clamp(2), minHeight: 40 }}
				>
					{mission.summary || mission.description || ""}
				</Typography>

				<Box sx={{ mt: "auto" }}>
					<Button
						fullWidth
						variant="contained"
						onClick={(e) => {
							e.stopPropagation();
							navigate("/login");
						}}
						sx={(theme) => ({
							height: BTN_H,
							textTransform: "none",
							bgcolor: theme.palette.primary.main,
							"&:hover": { bgcolor: theme.palette.primary.dark },
							borderRadius: 999,
						})}
					>
						Log in to track
					</Button>
				</Box>
			</CardContent>
		</Card>
	);
}

function PublicMissionsPage() {
	const [missions, setMissions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// ✅ Pagination state (same pattern)
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(6);

	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			try {
				setLoading(true);
				setError("");
				const data = await getMissions();
				if (!cancelled) setMissions(Array.isArray(data) ? data : data.missions || []);
			} catch (err) {
				console.error("Failed to fetch missions:", err);
				if (!cancelled) setError("Could not load missions. Please try again.");
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		load();
		return () => {
			cancelled = true;
		};
	}, []);

	// reset to page 1 when page size changes
	useEffect(() => {
		setPage(1);
	}, [pageSize]);

	// ✅ pagination derived values
	const total = missions.length;
	const pageCount = Math.max(1, Math.ceil(total / pageSize));
	const safePage = Math.min(page, pageCount);

	const startIndex = (safePage - 1) * pageSize;
	const endIndex = Math.min(startIndex + pageSize, total);
	const pagedMissions = useMemo(
		() => missions.slice(startIndex, endIndex),
		[missions, startIndex, endIndex]
	);

	return (
		<Box
			sx={(theme) => ({
				minHeight: "calc(100vh - 120px)",
				bgcolor: "background.default",
				py: 6,
				position: "relative",

				// ✅ top overlay from CustomThemeProvider tones (fades away, no border)
				"&:before": {
					content: '""',
					position: "absolute",
					left: 0,
					right: 0,
					top: 0,
					height: 220,
					background: `linear-gradient(180deg, ${theme.palette.tones.green.bg} 0%, transparent 75%)`,
					pointerEvents: "none",
					borderRadius:2,
				},
			})}
		>
			{/* keep all content above the gradient */}
			<Box sx={{ position: "relative" }}>
				<Container maxWidth="lg">
					<Box sx={{ mb: 3 }}>
						<Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
							Explore EcoTrack missions
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Preview some of the actions you can take. Log in to track your progress and see your impact.
						</Typography>
					</Box>

					{loading ? (
						<Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
							<CircularProgress />
						</Box>
					) : error ? (
						<Typography color="error" variant="body2">
							{error}
						</Typography>
					) : missions.length === 0 ? (
						<Typography variant="body2" color="text.secondary">
							No missions available yet.
						</Typography>
					) : (
						<>
							{/* ✅ Pagination controls */}
							<Stack
								direction={{ xs: "column", sm: "row" }}
								spacing={2}
								alignItems={{ xs: "stretch", sm: "center" }}
								justifyContent="space-between"
								sx={{ mb: 2 }}
							>
								<Typography variant="body2" color="text.secondary">
									{total === 0
										? "No missions to show."
										: `Showing ${startIndex + 1}-${endIndex} of ${total}`}
								</Typography>

								<Stack
									direction={{ xs: "column", sm: "row" }}
									spacing={1.5}
									alignItems={{ xs: "stretch", sm: "center" }}
									justifyContent="flex-end"
									sx={{ width: { xs: "100%", sm: "auto" } }}
								>
									<FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 160 } }}>
										<InputLabel id="public-page-size-label">Per page</InputLabel>
										<Select
											labelId="public-page-size-label"
											value={pageSize}
											label="Per page"
											onChange={(e) => setPageSize(Number(e.target.value))}
										>
											{PAGE_SIZE_OPTIONS.map((n) => (
												<MenuItem key={n} value={n}>
													{n}
												</MenuItem>
											))}
										</Select>
									</FormControl>

									<Box
										sx={{
											display: "flex",
											justifyContent: { xs: "center", sm: "flex-end" },
											width: { xs: "100%", sm: "auto" },
										}}
									>
										<Pagination
											count={pageCount}
											page={safePage}
											onChange={(_, value) => setPage(value)}
											color="primary"
											shape="rounded"
										/>
									</Box>
								</Stack>
							</Stack>

							{/* ✅ Dashboard-style CSS Grid */}
							<Box
								sx={{
									display: "grid",
									gap: 10,
									gridTemplateColumns: {
										xs: "1fr",
										sm: "repeat(2, minmax(0, 1fr))",
										md: "repeat(3, minmax(0, 1fr))",
									},
									alignItems: "start",
								}}
							>
								{pagedMissions.map((mission) => (
									<PublicMissionCard key={mission._id} mission={mission} />
								))}
							</Box>
						</>
					)}
				</Container>
			</Box>
		</Box>
	);
}

export default PublicMissionsPage;
