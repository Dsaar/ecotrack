import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

const RateLimitContext = createContext(null);

function toNiceWaitText({ retryAfter, rateLimitReset }) {
	// retry-after (seconds) is best if present
	const seconds = retryAfter ? Number(retryAfter) : null;
	if (Number.isFinite(seconds) && seconds > 0) {
		const mins = Math.ceil(seconds / 60);
		return mins <= 1 ? "Try again in about a minute." : `Try again in ~${mins} minutes.`;
	}

	// RateLimit-Reset can be a unix timestamp or seconds until reset depending on setup.
	// If yours is a date string, you can parse it.
	if (rateLimitReset) {
		const n = Number(rateLimitReset);
		if (Number.isFinite(n)) {
			// many setups send seconds-until-reset
			const mins = Math.ceil(n / 60);
			return mins <= 1 ? "Try again in about a minute." : `Try again in ~${mins} minutes.`;
		}

		const dt = new Date(rateLimitReset);
		if (!Number.isNaN(dt.getTime())) {
			return `Try again after ${dt.toLocaleTimeString()}.`;
		}
	}

	return "Please try again later.";
}

export function RateLimitProvider({ children }) {
	const [open, setOpen] = useState(false);
	const [payload, setPayload] = useState(null);

	useEffect(() => {
		const onHit = (e) => {
			setPayload(e.detail || null);
			setOpen(true);
		};

		window.addEventListener("rateLimit:hit", onHit);
		return () => window.removeEventListener("rateLimit:hit", onHit);
	}, []);

	const value = useMemo(
		() => ({
			lastRateLimit: payload,
			dismiss: () => setOpen(false),
		}),
		[payload]
	);

	return (
		<RateLimitContext.Provider value={value}>
			{children}

			<Snackbar
				open={open}
				onClose={() => setOpen(false)}
				autoHideDuration={8000}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					onClose={() => setOpen(false)}
					severity="warning"
					variant="filled"
					sx={{ width: "100%" }}
				>
					{payload?.message || "You’ve hit the request limit."}{" "}
					{toNiceWaitText(payload || {})}
				</Alert>
			</Snackbar>
		</RateLimitContext.Provider>
	);
}

export function useRateLimit() {
	return useContext(RateLimitContext);
}
