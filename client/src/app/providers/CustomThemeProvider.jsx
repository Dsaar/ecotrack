// src/app/providers/CustomThemeProvider.jsx
import {
	createContext,
	useContext,
	useMemo,
	useState,
} from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

const ThemeModeContext = createContext(null);

export function useThemeMode() {
	const ctx = useContext(ThemeModeContext);
	if (!ctx) {
		throw new Error("useThemeMode must be used within CustomThemeProvider");
	}
	return ctx;
}

function CustomThemeProvider({ children }) {
	const [mode, setMode] = useState(() => {
		if (typeof window === "undefined") return "light";
		return localStorage.getItem("ecotrack_theme") || "light";
	});

	const toggleColorMode = () => {
		setMode((prev) => {
			const next = prev === "light" ? "dark" : "light";
			try {
				localStorage.setItem("ecotrack_theme", next);
			} catch (e) {
				console.error("Failed to store theme", e);
			}
			return next;
		});
	};

	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode,
					primary: { main: "#166534" },
					background: {
						default: mode === "light" ? "#f3f4f6" : "#020617",
						paper: mode === "light" ? "#ffffff" : "#0b1120",
					},
				},
				shape: {
					borderRadius: 16,
				},
			}),
		[mode]
	);

	const value = { mode, toggleColorMode };

	return (
		<ThemeModeContext.Provider value={value}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</ThemeModeContext.Provider>
	);
}

export default CustomThemeProvider;
