// src/app/providers/CustomThemeProvider.jsx
import { createContext, useContext, useMemo, useState } from "react";
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

	const theme = useMemo(() => {
		const isLight = mode === "light";

		return createTheme({
			palette: {
				mode,
				primary: { main: "#166534" },

				background: {
					default: isLight ? "#f7f8fa" : "#020617",
					paper: isLight ? "#ffffff" : "#0b1120",
				},

				// ✅ Add your tones globally (works everywhere)
				tones: {
					green: {
						bg: isLight ? "rgba(22,101,52,0.10)" : "rgba(34,197,94,0.14)",
						fg: isLight ? "#166534" : "#22c55e",
					},
					blue: {
						bg: isLight ? "rgba(59,130,246,0.12)" : "rgba(59,130,246,0.16)",
						fg: isLight ? "#1d4ed8" : "#60a5fa",
					},
					amber: {
						bg: isLight ? "rgba(245,158,11,0.14)" : "rgba(245,158,11,0.18)",
						fg: isLight ? "#b45309" : "#fbbf24",
					},
					indigo: {
						bg: "rgba(99,102,241,0.14)",
						fg: "#4338ca",
					},
					rejected: {
						bg: "rgba(244,63,94,0.14)",   // soft rose background
						fg: "#be123c",                // deep rose text
						border: "rgba(244,63,94,0.32)",
					},

				},
			},

			shape: { borderRadius: 16 },

			components: {
				// Make UI feel more consistent across the whole app
				MuiCard: {
					styleOverrides: {
						root: ({ theme }) => ({
							borderRadius: 16,
							border: `1px solid ${theme.palette.divider}`,
							backgroundImage: "none",
						}),
					},
				},
				MuiButton: {
					styleOverrides: {
						root: {
							textTransform: "none",
							borderRadius: 999,
						},
					},
				},
				MuiChip: {
					styleOverrides: {
						root: {
							borderRadius: 999,
							fontWeight: 600,
						},
					},
				},
			},
		});
	}, [mode]);

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
