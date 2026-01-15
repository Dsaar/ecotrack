import { Box, Typography, Stack, FormControl, InputLabel, Select, MenuItem, Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useSearch } from "../../../app/providers/SearchProvider.jsx";
import FavoriteButton from "../../missions/components/FavoriteButton.jsx";
import DashboardMissionsGrid from "../components/DashboardMissionsGrid.jsx";

import useDashboardFavorites from "../favorites/hooks/useDashboardFavorites.js";

const PAGE_SIZE_OPTIONS = [6, 12, 24];

export default function DashboardFavoritesPage() {
	const navigate = useNavigate();
	const { query, setQuery } = useSearch();

	const {
		loading,
		q,
		filteredMissions,
		pagedMissions,

		pageSize,
		setPageSize,
		setPage,
		paging,

		handleUnfavorite,
	} = useDashboardFavorites({ query, setQuery });

	// Wrap FavoriteButton so the grid can call it like a component
	const FavoriteBtn = ({ missionId }) => (
		<FavoriteButton missionId={missionId} onUnfavorite={handleUnfavorite} />
	);

	return (
		<Box
			sx={(theme) => ({
				p: { xs: 2, md: 3 },
				maxWidth: 1200,
				position: "relative",
				"&:before": {
					content: '""',
					position: "absolute",
					left: 0,
					right: 0,
					top: 0,
					height: 190,
					borderRadius: 2,
					background: `linear-gradient(180deg, ${theme.palette.tones.indigo.bg} 0%, transparent 75%)`,
					pointerEvents: "none",
				},
			})}
		>
			<Box sx={{ position: "relative" }}>
				<Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
					Saved missions
				</Typography>

				<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
					Quickly access missions you have bookmarked to complete later.
				</Typography>

				{loading ? (
					<Typography variant="body2" color="text.secondary">
						Loading your saved missions...
					</Typography>
				) : filteredMissions.length === 0 ? (
					<Typography variant="body2" color="text.secondary">
						{q
							? "No saved missions match your search."
							: "You don't have any saved missions yet. Tap the star icon on a mission to save it here."}
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
								{`Showing ${paging.startIndex + 1}-${paging.endIndex} of ${paging.total}`}
							</Typography>

							<Stack
								direction={{ xs: "column", sm: "row" }}
								spacing={1.5}
								alignItems={{ xs: "stretch", sm: "center" }}
								justifyContent="flex-end"
								sx={{ width: { xs: "100%", sm: "auto" } }}
							>
								<FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 160 } }}>
									<InputLabel id="page-size-label">Per page</InputLabel>
									<Select
										labelId="page-size-label"
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

						<DashboardMissionsGrid
							missions={pagedMissions}
							isAdmin={false}
							onOpenDetails={(id) => navigate(`/dashboard/missions/${id}`)}
							onTogglePublish={() => { }}
							onEditPage={() => { }}
							onDelete={() => { }}
							FavoriteButtonComponent={FavoriteBtn}
						/>
					</>
				)}
			</Box>
		</Box>
	);
}
