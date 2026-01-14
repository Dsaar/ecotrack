// src/features/dashboard/pages/admin/hooks/useAdminSubmissions.js
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	adminApproveSubmission,
	adminListSubmissions,
	adminRejectSubmission,
} from "../../../../../services/adminSubmissionsService.js";

/**
 * Keeps AdminSubmissionsPage lean by owning:
 * - status filter
 * - load lifecycle
 * - approve/reject actions
 * - acting state
 *
 * No UI decisions here, no routing here.
 */
export default function useAdminSubmissions({ showSuccess, showError }) {
	const [status, setStatus] = useState("pending");
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [actingId, setActingId] = useState(null);

	const load = useCallback(
		async (opts = {}) => {
			const { page = 1, limit = 30, statusOverride } = opts;
			const effectiveStatus = statusOverride ?? status;

			try {
				setLoading(true);
				const res = await adminListSubmissions({
					status: effectiveStatus,
					page,
					limit,
				});
				setItems(res.data?.items || []);
			} catch (err) {
				console.error("[useAdminSubmissions] load failed", err);
				showError?.(err?.response?.data?.message || "Failed to load submissions.");
			} finally {
				setLoading(false);
			}
		},
		[status, showError]
	);

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status]);

	const approve = useCallback(
		async (id) => {
			try {
				setActingId(id);
				await adminApproveSubmission(id);
				showSuccess?.("Submission approved.");
				await load();
			} catch (err) {
				console.error("[useAdminSubmissions] approve failed", err);
				showError?.(err?.response?.data?.message || "Failed to approve submission.");
			} finally {
				setActingId(null);
			}
		},
		[load, showSuccess, showError]
	);

	const reject = useCallback(
		async (id, reason) => {
			if (!id) return;

			try {
				setActingId(id);
				await adminRejectSubmission(id, reason);
				showSuccess?.("Submission rejected.");
				await load();
			} catch (err) {
				console.error("[useAdminSubmissions] reject failed", err);
				showError?.(err?.response?.data?.message || "Failed to reject submission.");
			} finally {
				setActingId(null);
			}
		},
		[load, showSuccess, showError]
	);

	const rows = useMemo(() => items, [items]);

	return {
		// state
		status,
		rows,
		loading,
		actingId,

		// actions
		setStatus,
		load,
		approve,
		reject,
	};
}
