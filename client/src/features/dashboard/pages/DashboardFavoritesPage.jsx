// src/features/missions/pages/DashboardFavoritesPage.jsx
import { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { getFavoriteMissions } from "../../../services/favoritesService.js";
import MissionDescriptionCard from "../components/MissionDescriptionCard.jsx";

function DashboardFavoritesPage() {
	const [missions, setMissions] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				setLoading(true);
				const res = await getFavoriteMissions();

				// Backend now returns an array: [ { _id, title, ... }, ... ]
				let data = res.data;

				// If for some reason it's wrapped in an object, unwrap common shapes
				if (Array.isArray(data)) {
					// ok
				} else if (Array.isArray(data.missions)) {
					data = data.missions;
				} else if (Array.isArray(data.favorites?.missions)) {
					data = data.favorites.missions;
				} else {
					data = [];
				}

				if (!cancelled) {
					setMissions(data);
				}
			} catch (err) {
				console.error("[DashboardFavoritesPage] Failed to load favorites:", err);
				if (!cancelled) {
					setMissions([]);
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		load();
		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<Box sx={{ p: { xs: 2, md: 3 } }}>
			<Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
				Saved missions
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
				Quickly access missions you&apos;ve bookmarked to complete later.
			</Typography>

			{loading ? (
				<Typography variant="body2" color="text.secondary">
					Loading your saved missions...
				</Typography>
			) : missions.length === 0 ? (
				<Typography variant="body2" color="text.secondary">
					You don&apos;t have any saved missions yet. Tap the star icon on a mission to save it here.
				</Typography>
			) : (
				<Stack spacing={2}>
					{missions.map((m) => (
						<MissionDescriptionCard key={m._id} mission={m} />
					))}
				</Stack>
			)}
		</Box>
	);
}

export default DashboardFavoritesPage;
