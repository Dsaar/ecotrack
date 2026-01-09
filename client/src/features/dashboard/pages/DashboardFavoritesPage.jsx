// client/src/features/dashboard/pages/DashboardFavoritesPage.jsx
import { useEffect, useMemo, useState } from "react";
import {
	Box,
	Typography,
	Stack,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { getFavoriteMissions } from "../../../services/favoritesService.js";
import { useSearch } from "../../../app/providers/SearchProvider.jsx";
import FavoriteButton from "../../missions/components/FavoriteButton.jsx";
import DashboardMissionsGrid from "../components/DashboardMissionsGrid.jsx";

const PAGE_SIZE_OPTIONS = [6, 12, 24];

function DashboardFavoritesPage() {
	const navigate = useNavigate();

	const [missions, setMissions] = useState([]);
	const [loading, setLoading] = useState(true);

	// --- Pagination state ---
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(6);

	const { query, setQuery } = useSearch();
	const q = (query || "").trim().toLowerCase();

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				setLoading(true);
				const res = await getFavoriteMissions();

				let data = res?.data ?? res;

				if (Array.isArray(data)) {
					// ok
				} else if (Array.isArray(data?.missions)) {
					data = data.missions;
				} else if (Array.isArray(data?.favorites?.missions)) {
					data = data.favorites.missions;
				} else {
					data = [];
				}

				if (!cancelled) setMissions(data);
			} catch (err) {
				console.error("[DashboardFavoritesPage] Failed to load favorites:", err);
				if (!cancelled) setMissions([]);
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		load();
		return () => {
			cancelled = true;
		};
	}, []);

	// ✅ cleanup search query when leaving the page
	useEffect(() => {
		return () => setQuery("");
	}, [setQuery]);

	// ✅ Filter favorites based on global query
	const filteredMissions = useMemo(() => {
		if (!q) return missions;

		return missions.filter((m) => {
			const title = (m.title || "").toLowerCase();
			const summary = (m.summary || "").toLowerCase();
			const category = (m.category || "").toLowerCase();
			const difficulty = (m.difficulty || "").toLowerCase();
			const tags = Array.isArray(m.tags) ? m.tags.join(" ").toLowerCase() : "";

			return (
				title.includes(q) ||
				summary.includes(q) ||
				category.includes(q) ||
				difficulty.includes(q) ||
				tags.includes(q)
			);
		});
	}, [missions, q]);

	const handleUnfavorite = (missionId) => {
		setMissions((prev) => prev.filter((m) => String(m._id) !== String(missionId)));
	};

	// Wrap FavoriteButton so the grid can call it like a component
	const FavoriteBtn = ({ missionId }) => (
		<FavoriteButton missionId={missionId} onUnfavorite={handleUnfavorite} />
	);

	// ✅ Reset to first page when search changes or pageSize changes
	useEffect(() => {
		setPage(1);
	}, [q, pageSize]);

	// ✅ Pagination calculations
	const total = filteredMissions.length;
	const pageCount = Math.max(1, Math.ceil(total / pageSize));
	const safePage = Math.min(page, pageCount);

	const startIndex = (safePage - 1) * pageSize;
	const endIndex = Math.min(startIndex + pageSize, total);
	const pagedMissions = filteredMissions.slice(startIndex, endIndex);

	useEffect(() => {
		const newPageCount = Math.max(1, Math.ceil(filteredMissions.length / pageSize));
		if (page > newPageCount) setPage(newPageCount);
	}, [filteredMissions.length, page, pageSize]);

	return (
		<Box
			sx={(theme) => ({
				p: { xs: 2, md: 3 },
				maxWidth: 1200,
				position: "relative",

				// ✅ top gradient only (Saved missions -> indigo)
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
			{/* keep content above the gradient */}
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
						{/* ✅ Pagination controls */}
						<Stack
							direction={{ xs: "column", sm: "row" }}
							spacing={2}
							alignItems={{ xs: "stretch", sm: "center" }}
							justifyContent="space-between"
							sx={{ mb: 2 }}
						>
							<Typography variant="body2" color="text.secondary">
								{`Showing ${startIndex + 1}-${endIndex} of ${total}`}
							</Typography>

							<Stack
								direction={{ xs: "column", sm: "row" }}
								spacing={1.5}
								alignItems={{ xs: "stretch", sm: "center" }}
								justifyContent="flex-end"
								sx={{ width: { xs: "100%", sm: "auto" } }}
							>
								<FormControl
									size="small"
									sx={{
										minWidth: { xs: "100%", sm: 160 },
									}}
								>
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
										count={pageCount}
										page={safePage}
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

export default DashboardFavoritesPage;
