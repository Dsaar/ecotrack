// src/features/dashboard/components/MissionHeader.jsx
import { Box, Button, Chip, Stack, Typography } from "@mui/material";

function MissionHeader({ title, summary, category, difficulty, onBack }) {
	return (
		<Box>
			<Button
				size="small"
				sx={{ textTransform: "none", mb: 1 }}
				onClick={onBack}
			>
				← Back to missions
			</Button>

			<Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
				{title}
			</Typography>

			<Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap">
				{category && <Chip size="small" label={category} variant="outlined" />}
				{difficulty && (
					<Chip
						size="small"
						label={difficulty}
						color={
							difficulty === "Easy"
								? "success"
								: difficulty === "Hard"
									? "error"
									: "warning"
						}
						variant="outlined"
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

export default MissionHeader;
