import { Box } from "@mui/material";

export default function TonePanel({
	tone = "green",
	variant = "soft", // "soft" | "outline"
	sx,
	children,
	...props
}) {
	return (
		<Box
			{...props}
			sx={(theme) => {
				const t = theme.palette.tones?.[tone] || theme.palette.tones.green;

				return {
					borderRadius: 1,
					p: 2,
					...(variant === "outline"
						? {
							border: "1px solid",
							borderColor: "divider",
							backgroundColor: "transparent",
						}
						: {
							backgroundColor: t.bg,
							color: t.fg,
							border: "1px solid",
							borderColor: "divider",
						}),
					...sx,
				};
			}}
		>
			{children}
		</Box>
	);
}
