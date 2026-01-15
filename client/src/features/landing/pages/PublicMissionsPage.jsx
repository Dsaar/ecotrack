// src/features/landing/pages/PublicMissionsPage.jsx
import {
	Box,
	CircularProgress,
	Container,
	Typography,
	Stack,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Pagination,
} from "@mui/material";

import usePublicMissions from "../missions/hooks/usePublicMissions.js";
import PublicMissionCard from "../missions/components/PublicMissionCard.jsx";
import { PAGE_SIZE_OPTIONS } from "../missions/utils/publicMissionsHelpers.js";

export default function PublicMissionsPage() {
	const { missions, loading, error, pageSize, setPageSize, setPage, paging } = usePublicMissions();

	return (
		<Box
			sx={(theme) => ({
				minHeight: "calc(100vh - 120px)",
				bgcolor: "background.default",
				py: 6,
				position: "relative",
				"&:before": {
					content: '""',
					position: "absolute",
					left: 0,
					right: 0,
					top: 0,
					height: 220,
					background: `linear-gradient(180deg, ${theme.palette.tones.green.bg} 0%, transparent 75%)`,
					pointerEvents: "none",
					borderRadius: 2,
				},
			})}
		>
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
							{/* Pagination controls */}
							<Stack
								direction={{ xs: "column", sm: "row" }}
								spacing={2}
								alignItems={{ xs: "stretch", sm: "center" }}
								justifyContent="space-between"
								sx={{ mb: 2 }}
							>
								<Typography variant="body2" color="text.secondary">
									{paging.total === 0
										? "No missions to show."
										: `Showing ${paging.startIndex + 1}-${paging.endIndex} of ${paging.total}`}
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
											count={paging.pageCount}
											page={paging.safePage}
											onChange={(_, value) => setPage(value)}
											color="primary"
											shape="rounded"
										/>
									</Box>
								</Stack>
							</Stack>

							{/* Grid */}
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
								{paging.pagedItems.map((mission) => (
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
