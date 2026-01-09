import { Box } from "@mui/material";

export default function ToneBox({ tone = "green", sx, children, ...props }) {
	return (
		<Box
			{...props}
			sx={(theme) => ({
				backgroundColor: theme.palette.tones?.[tone]?.bg,
				color: theme.palette.tones?.[tone]?.fg,
				borderRadius: 16,
				...sx,
			})}
		>
			{children}
		</Box>
	);
}
