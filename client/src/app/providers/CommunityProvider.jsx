// src/app/providers/CommunityProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getCommunityOverview } from "../../services/communityService.js";
import { useUser } from "./UserProvider.jsx";
import { useSnackbar } from "./SnackBarProvider.jsx";

const CommunityContext = createContext(null);

export function CommunityProvider({ children }) {
	const { user, initializing } = useUser();
	const { showError } = useSnackbar();

	const [communityData, setCommunityData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const load = async () => {
		if (!user) {
			setCommunityData(null);
			return;
		}

		try {
			setLoading(true);
			setError("");
			const data = await getCommunityOverview();
			setCommunityData(data);
		} catch (err) {
			console.error("[CommunityProvider] Failed to load overview:", err);
			const msg =
				err?.response?.data?.message ||
				"Failed to load community data. Some info may be unavailable.";
			setError(msg);
			showError?.(msg);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!initializing && user) {
			load();
		} else if (!user) {
			setCommunityData(null);
		}
	}, [user, initializing]); // eslint-disable-line react-hooks/exhaustive-deps

	const value = {
		communityData,
		loading,
		error,
		refreshCommunity: load,
	};

	return (
		<CommunityContext.Provider value={value}>
			{children}
		</CommunityContext.Provider>
	);
}

export function useCommunity() {
	// fallback so components don’t crash if used outside provider
	return (
		useContext(CommunityContext) || {
			communityData: null,
			loading: false,
			error: "",
			refreshCommunity: () => { },
		}
	);
}
