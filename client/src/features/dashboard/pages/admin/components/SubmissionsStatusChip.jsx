// src/features/dashboard/pages/admin/components/SubmissionStatusChip.jsx
import { Chip, useTheme } from "@mui/material";

export default function SubmissionStatusChip({ status }) {
	const theme = useTheme();

	// theme-driven tones (exactly like in the page)
	const toneChipSx = (toneKey) => {
		const tone = theme.palette?.tones?.[toneKey] || {};
		return {
			bgcolor: tone.bg || "transparent",
			color: tone.fg || "text.primary",
			border: "1px solid",
			borderColor: tone.border || "transparent",
			fontWeight: 800,
		};
	};

	if (status === "approved") {
		return <Chip size="small" label="Approved" sx={toneChipSx("green")} />;
	}
	if (status === "rejected") {
		return <Chip size="small" label="Rejected" sx={toneChipSx("rejected")} />;
	}
	return <Chip size="small" label="Pending" sx={toneChipSx("amber")} />;
}
