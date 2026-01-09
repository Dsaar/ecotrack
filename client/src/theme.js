// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
	palette: {
		mode: "light",

		primary: { main: "#166534" }, // eco green

		// Nice neutral base so pages don't feel empty/grey
		background: {
			default: "#f7f8fa",
			paper: "#ffffff",
		},

		// ✅ Global "tones" you can use across the whole app
		tones: {
			green: { bg: "rgba(22,101,52,0.10)", fg: "#166534" },
			blue: { bg: "rgba(59,130,246,0.12)", fg: "#1d4ed8" },
			amber: { bg: "rgba(245,158,11,0.14)", fg: "#b45309" },
		},
	},

	shape: {
		borderRadius: 14,
	},

	typography: {
		fontFamily: `"Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`,
	},

	components: {
		// Make cards look like your "About" style everywhere
		MuiCard: {
			styleOverrides: {
				root: ({ theme }) => ({
					borderRadius: 16,
					border: `1px solid ${theme.palette.divider}`,
					backgroundImage: "none",
				}),
			},
		},

		// Make buttons consistent (you already do some inline)
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
					borderRadius: 999,
				},
			},
		},

		// Chip look is useful for category/difficulty labels
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

export default theme;
