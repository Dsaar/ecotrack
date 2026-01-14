// src/features/dashboard/pages/admin/hooks/useAdminUsers.js
import { useEffect, useMemo, useState } from "react";
import {
	getAllUsersAdmin,
	setUserAdminStatus,
	deleteUserAdmin,
} from "../../../../../services/userService.js";
import { normalizeQuery, userMatchesQuery } from "../utils/userViewHelpers.js";

export default function useAdminUsers({ query, showSuccess, showError, setQuery }) {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	const [deleteOpen, setDeleteOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [deleting, setDeleting] = useState(false);

	// Pagination
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(6);

	// ✅ Clear search when leaving this page
	useEffect(() => {
		return () => setQuery("");
	}, [setQuery]);

	// Load users
	useEffect(() => {
		let cancelled = false;

		(async () => {
			try {
				setLoading(true);
				const data = await getAllUsersAdmin();
				if (!cancelled) setUsers(Array.isArray(data) ? data : []);
			} catch (err) {
				showError?.(err?.response?.data?.message || "Failed to load users.");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [showError]);

	// Filtering (driven by TopBar search query)
	const q = normalizeQuery(query);

	const filteredUsers = useMemo(() => {
		if (!q) return users;
		return users.filter((u) => userMatchesQuery(u, q));
	}, [users, q]);

	// Reset page when filter or page size changes
	useEffect(() => {
		setPage(1);
	}, [q, pageSize]);

	const total = filteredUsers.length;
	const pageCount = Math.max(1, Math.ceil(total / pageSize));
	const safePage = Math.min(page, pageCount);

	const startIndex = (safePage - 1) * pageSize;
	const endIndex = Math.min(startIndex + pageSize, total);

	const pagedUsers = filteredUsers.slice(startIndex, endIndex);

	const toggleAdmin = async (u) => {
		const next = !u.isAdmin;

		// optimistic UI
		setUsers((prev) => prev.map((x) => (x._id === u._id ? { ...x, isAdmin: next } : x)));

		try {
			const updated = await setUserAdminStatus(u._id, { isAdmin: next });
			setUsers((prev) => prev.map((x) => (x._id === u._id ? updated : x)));
			showSuccess?.(next ? "User promoted to admin." : "Admin rights removed.");
		} catch (err) {
			// rollback
			setUsers((prev) => prev.map((x) => (x._id === u._id ? u : x)));
			showError?.(err?.response?.data?.message || "Failed to update user.");
		}
	};

	const openDelete = (u) => {
		setDeleteTarget(u);
		setDeleteOpen(true);
	};

	const closeDelete = () => {
		if (deleting) return;
		setDeleteOpen(false);
		setDeleteTarget(null);
	};

	const confirmDelete = async () => {
		if (!deleteTarget?._id) return;

		const id = deleteTarget._id;
		const prev = users;

		// optimistic remove
		setUsers((cur) => cur.filter((x) => x._id !== id));

		try {
			setDeleting(true);
			await deleteUserAdmin(id);
			showSuccess?.("User deleted.");
			closeDelete();
		} catch (err) {
			setUsers(prev); // rollback
			showError?.(err?.response?.data?.message || "Failed to delete user.");
		} finally {
			setDeleting(false);
		}
	};

	return {
		users,
		loading,

		q,
		filteredUsers,
		pagedUsers,

		page,
		pageSize,
		pageCount,
		safePage,
		startIndex,
		endIndex,
		total,

		setPage,
		setPageSize,

		toggleAdmin,

		deleteOpen,
		deleteTarget,
		deleting,
		openDelete,
		closeDelete,
		confirmDelete,
	};
}
