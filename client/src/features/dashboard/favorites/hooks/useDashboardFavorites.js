import { useEffect, useMemo, useState } from "react";
import { getFavoriteMissions } from "../../../../services/favoritesService.js";


export default function useDashboardFavorites({ query, setQuery }) {
	const [missions, setMissions] = useState([]);
	const [loading, setLoading] = useState(true);

	// pagination
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(6);

	// normalize query
	const q = (query || "").trim().toLowerCase();

	// load favorites once
	useEffect(() => {
		let cancelled = false;

		(async () => {
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
				console.error("[useDashboardFavorites] Failed to load favorites:", err);
				if (!cancelled) setMissions([]);
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, []);

	// clear search on unmount (same as your current page)
	useEffect(() => {
		return () => setQuery?.("");
	}, [setQuery]);

	// filter
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

	// unfavorite (local remove)
	const handleUnfavorite = (missionId) => {
		setMissions((prev) => prev.filter((m) => String(m._id) !== String(missionId)));
	};

	// reset to first page on search/pageSize changes
	useEffect(() => {
		setPage(1);
	}, [q, pageSize]);

	// pagination calc
	const total = filteredMissions.length;
	const pageCount = Math.max(1, Math.ceil(total / pageSize));
	const safePage = Math.min(page, pageCount);

	const startIndex = (safePage - 1) * pageSize;
	const endIndex = Math.min(startIndex + pageSize, total);

	const pagedMissions = filteredMissions.slice(startIndex, endIndex);

	// keep page in range
	useEffect(() => {
		const newPageCount = Math.max(1, Math.ceil(filteredMissions.length / pageSize));
		if (page > newPageCount) setPage(newPageCount);
	}, [filteredMissions.length, page, pageSize]);

	return {
		loading,

		// query
		q,

		// data
		missions,
		filteredMissions,
		pagedMissions,

		// pagination
		page,
		setPage,
		pageSize,
		setPageSize,
		paging: {
			total,
			pageCount,
			safePage,
			startIndex,
			endIndex,
		},

		// actions
		handleUnfavorite,
	};
}
