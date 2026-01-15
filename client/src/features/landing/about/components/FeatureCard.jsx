// client/src/features/landing/about/components/FeatureCard.jsx
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";

function getToneStyles(tone) {
	if (tone === "blue") return { bg: "rgba(59,130,246,0.12)", fg: "#1d4ed8" };
	if (tone === "amber") return { bg: "rgba(245,158,11,0.14)", fg: "#b45309" };
	return { bg: "rgba(22,101,52,0.10)", fg: "#166534" };
}

export default function FeatureCard({ icon, title, description, chips = [], tone = "green" }) {
	const toneStyles = getToneStyles(tone);

	return (
		<Card
			sx={{
				height: "100%",
				borderRadius: 2,
				border: "1px solid",
				borderColor: "divider",
				boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
				transition: "transform .15s ease, box-shadow .15s ease",
				"&:hover": {
					transform: "translateY(-3px)",
					boxShadow: "0 18px 38px rgba(0,0,0,0.10)",
				},
			}}
		>
			<CardContent sx={{ p: { xs: 2.25, md: 2.75 } }}>
				<Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.25 }}>
					<Box
						sx={{
							width: 44,
							height: 44,
							borderRadius: 2,
							display: "grid",
							placeItems: "center",
							bgcolor: toneStyles.bg,
							color: toneStyles.fg,
						}}
					>
						{icon}
					</Box>

					<Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
						{title}
					</Typography>
				</Stack>

				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ mb: chips.length ? 1.5 : 0 }}
				>
					{description}
				</Typography>

				{chips.length > 0 && (
					<Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
						{chips.map((c) => (
							<Chip
								key={c}
								size="small"
								label={c}
								variant="outlined"
								sx={{ borderRadius: 999, fontSize: 12 }}
							/>
						))}
					</Stack>
				)}
			</CardContent>
		</Card>
	);
}
