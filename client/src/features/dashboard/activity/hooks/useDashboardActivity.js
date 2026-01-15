// client/src/features/dashboard/activity/hooks/useDashboardActivity.js
import { useEffect, useMemo, useState } from "react";

import { getMyCheckins } from "../../../../services/checkinService.js";
import { getMySubmissions } from "../../../../services/submissionsService.js";

import {
	getSubmissionsArray,
	normalizeArrayResponse,
	statusLower,
	sumCheckins,
} from "../utils/activityHelpers.js";

export default function useDashboardActivity() {
	const [checkins, setCheckins] = useState([]);
	const [submissions, setSubmissions] = useState([]);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const [tab, setTab] = useState("approved");

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				setLoading(true);
				setError("");

				const [checkinsRes, submissionsRes] = await Promise.all([
					getMyCheckins(),
					getMySubmissions(),
				]);

				const checkinsData = normalizeArrayResponse(checkinsRes);
				const subsData = getSubmissionsArray(submissionsRes);

				if (!cancelled) {
					setCheckins(Array.isArray(checkinsData) ? checkinsData : []);
					setSubmissions(Array.isArray(subsData) ? subsData : []);
				}
			} catch (err) {
				console.error("Failed to load activity:", err);
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

	const pendingSubs = useMemo(
		() => submissions.filter((s) => statusLower(s?.status) === "pending"),
		[submissions]
	);

	const rejectedSubs = useMemo(
		() => submissions.filter((s) => statusLower(s?.status) === "rejected"),
		[submissions]
	);

	const totals = useMemo(() => sumCheckins(checkins), [checkins]);

	return {
		checkins,
		submissions,
		pendingSubs,
		rejectedSubs,
		totals,

		loading,
		error,

		tab,
		setTab,
	};
}
