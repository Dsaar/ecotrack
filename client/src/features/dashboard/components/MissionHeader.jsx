// src/features/dashboard/components/MissionHeader.jsx
import { Box, Button, Chip, Stack, Typography } from "@mui/material";

export default function MissionHeader({
	title,
	summary,
	category,
	difficulty,
	imageUrl,
	onBack,
}) {
	return (
		<Box>
			<Button
				size="small"
				sx={{ textTransform: "none", mb: 1 }}
				onClick={onBack}
			>
				← Back to missions
			</Button>

			{/* Image banner (optional) */}
			{imageUrl ? (
				<Box
					sx={{
						width: "100%",
						height: { xs: 160, sm: 200 },
						borderRadius: 3,
						overflow: "hidden",
						border: "1px solid",
						borderColor: "divider",
						mb: 2,
						backgroundImage: `url(${imageUrl})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				/>
			) : null}

			<Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
				{title}
			</Typography>

			<Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap">
				{category && (
					<Chip size="small" label={category} variant="outlined" />
				)}
				{difficulty && (
					<Chip
						size="small"
						label={difficulty}
						variant="outlined"
						color={
							difficulty === "Easy"
								? "success"
								: difficulty === "Hard"
									? "error"
									: "warning"
						}
					/>
				)}
			</Stack>

			{summary && (
				<Typography variant="body2" color="text.secondary">
					{summary}
				</Typography>
			)}
		</Box>
	);
}
