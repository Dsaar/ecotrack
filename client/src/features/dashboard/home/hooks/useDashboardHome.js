// client/src/features/dashboard/home/hooks/useDashboardHome.js
import { useEffect, useMemo, useState } from "react";
import { getMySubmissions } from "../../../../services/submissionsService.js";
import { normalizeSubmissions, getToneFromStatus } from "../utils/dashboardHomeHelpers.js";

export default function useDashboardHome() {
	const [submissions, setSubmissions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				setLoading(true);
				setError("");

				const res = await getMySubmissions();
				const subs = normalizeSubmissions(res);

				if (!cancelled) setSubmissions(subs);
			} catch (err) {
				console.error("[useDashboardHome] Failed to load submissions:", err);
				if (!cancelled) {
					setError(
						err?.response?.data?.message ||
						"Failed to load your activity. Please try again."
					);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		load();
		return () => {
			cancelled = true;
		};
	}, []);

	const stats = useMemo(() => {
		const totalSubmissions = submissions.length;

		const pendingSubmissions = submissions.filter((s) => s.status === "pending").length;
		const approvedSubmissions = submissions.filter((s) => s.status === "approved").length;

		const lastSubmission = submissions.length > 0 ? submissions[0] : null;
		const latestTone = getToneFromStatus(lastSubmission?.status);

		return {
			totalSubmissions,
			pendingSubmissions,
			approvedSubmissions,
			lastSubmission,
			latestTone,
		};
	}, [submissions]);

	return {
		submissions,
		loading,
		error,
		...stats,
	};
}
