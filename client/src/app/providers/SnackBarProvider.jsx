// src/app/providers/SnackbarProvider.jsx
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const SnackbarContext = createContext(null);

export function SnackbarProvider({ children }) {
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});

	const showSnackbar = useCallback((message, severity = "success") => {
		if (!message) return;
		setSnackbar({ open: true, message, severity });
	}, []);

	const handleClose = (_, reason) => {
		if (reason === "clickaway") return;
		setSnackbar((prev) => ({ ...prev, open: false }));
	};

	// ✅ Listen for rate limit events from apiClient (429)
	useEffect(() => {
		const onRateLimit = (e) => {
			const msg = e?.detail?.message || "Too many requests. Please try again later.";

			// Optional: nicer message when retry-after exists
			const retryAfter = e?.detail?.retryAfter;
			const finalMsg =
				typeof retryAfter === "number" && Number.isFinite(retryAfter) && retryAfter > 0
					? `${msg} Try again in ~${retryAfter}s.`
					: msg;

			showSnackbar(finalMsg, "warning");
		};

		window.addEventListener("app:rate-limit", onRateLimit);
		return () => window.removeEventListener("app:rate-limit", onRateLimit);
	}, [showSnackbar]);

	const value = {
		showSuccess: (msg) => showSnackbar(msg, "success"),
		showError: (msg) => showSnackbar(msg, "error"),
		showInfo: (msg) => showSnackbar(msg, "info"),
		showWarning: (msg) => showSnackbar(msg, "warning"),
	};

	return (
		<SnackbarContext.Provider value={value}>
			{children}
			<Snackbar
				open={snackbar.open}
				autoHideDuration={4000}
				onClose={handleClose}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: "100%" }}>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</SnackbarContext.Provider>
	);
}

export function useSnackbar() {
	const ctx = useContext(SnackbarContext);
	if (!ctx) {
		throw new Error("useSnackbar must be used within a SnackbarProvider");
	}
	return ctx;
}
