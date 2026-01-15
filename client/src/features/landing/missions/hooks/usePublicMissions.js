// client/src/features/landing/missions/hooks/usePublicMissions.js
import { useEffect, useMemo, useState } from "react";
import { getMissions } from "../../../../services/missionsService.js";
import { normalizeMissions } from "../utils/publicMissionsHelpers.js";

export default function usePublicMissions() {
	const [missions, setMissions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(6);

	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			try {
				setLoading(true);
				setError("");

				const res = await getMissions();
				const list = normalizeMissions(res);

				if (!cancelled) setMissions(list);
			} catch (err) {
				console.error("[usePublicMissions] Failed to fetch missions:", err);
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

	const paging = useMemo(() => {
		const total = missions.length;
		const pageCount = Math.max(1, Math.ceil(total / pageSize));
		const safePage = Math.min(page, pageCount);

		const startIndex = (safePage - 1) * pageSize;
		const endIndex = Math.min(startIndex + pageSize, total);

		const pagedItems = missions.slice(startIndex, endIndex);

		return { total, pageCount, safePage, startIndex, endIndex, pagedItems };
	}, [missions, page, pageSize]);

	return {
		missions,
		loading,
		error,

		page,
		setPage,
		pageSize,
		setPageSize,
		paging,
	};
}
