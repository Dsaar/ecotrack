import { Box, Chip, Stack, Typography, Button } from "@mui/material";

export default function MissionHeader({
	title,
	summary,
	category,
	difficulty,
	points,
	duration,
	tags = [],
	onBack,
}) {
	return (
		<Box>
			<Button onClick={onBack} sx={{ textTransform: "none", mb: 1 }}>
				← Back to missions
			</Button>

			<Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
				{title}
			</Typography>

			<Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
				{category && <Chip size="small" label={category} variant="outlined" />}
				{difficulty && <Chip size="small" label={difficulty} variant="outlined" />}

				{Number.isFinite(points) && (
					<Chip size="small" label={`${points} pts`} color="success" variant="outlined" />
				)}

				{duration && <Chip size="small" label={duration} variant="outlined" />}

				{tags?.slice(0, 5).map((t) => (
					<Chip key={t} size="small" label={t} variant="outlined" />
				))}
			</Stack>

			{summary && (
				<Typography variant="body2" color="text.secondary">
					{summary}
				</Typography>
			)}
		</Box>
	);
}
