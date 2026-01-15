// client/src/features/landing/missions/components/PublicMissionCard.jsx
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { clamp, difficultyColor } from "../utils/publicMissionsHelpers.js";

export default function PublicMissionCard({ mission }) {
	const navigate = useNavigate();

	const CARD_H = 360;
	const IMAGE_H = 150;
	const BTN_H = 44;

	return (
		<Card
			variant="outlined"
			sx={{
				height: CARD_H,
				width: "100%",
				display: "flex",
				flexDirection: "column",
				cursor: "pointer",
				borderRadius: 1.4,
				overflow: "hidden",
				"&:hover": { boxShadow: 3 },
			}}
			onClick={() => navigate("/login")}
		>
			<Box
				sx={{
					height: IMAGE_H,
					width: "100%",
					bgcolor: "action.hover",
					backgroundImage: mission?.imageUrl ? `url(${mission.imageUrl})` : "none",
					backgroundSize: "cover",
					backgroundPosition: "center",
					flexShrink: 0,
				}}
			/>

			<CardContent
				sx={{
					flex: 1,
					minHeight: 0,
					display: "flex",
					flexDirection: "column",
					p: 2,
					gap: 1,
				}}
			>
				<Typography
					variant="subtitle1"
					sx={{
						fontWeight: 700,
						lineHeight: 1.2,
						...clamp(2),
						minHeight: 42,
					}}
				>
					{mission?.title || "Untitled mission"}
				</Typography>

				<Box sx={{ minHeight: 34, display: "flex", alignItems: "center" }}>
					<Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
						{mission?.category && (
							<Chip size="small" label={mission.category} variant="outlined" />
						)}
						{mission?.difficulty && (
							<Chip
								size="small"
								label={mission.difficulty}
								variant="outlined"
								color={difficultyColor(mission.difficulty)}
							/>
						)}
					</Stack>
				</Box>

				<Typography variant="body2" color="text.secondary" sx={{ ...clamp(2), minHeight: 40 }}>
					{mission?.summary || mission?.description || ""}
				</Typography>

				<Box sx={{ mt: "auto" }}>
					<Button
						fullWidth
						variant="contained"
						onClick={(e) => {
							e.stopPropagation();
							navigate("/login");
						}}
						sx={(theme) => ({
							height: BTN_H,
							textTransform: "none",
							bgcolor: theme.palette.primary.main,
							"&:hover": { bgcolor: theme.palette.primary.dark },
							borderRadius: 999,
						})}
					>
						Log in to track
					</Button>
				</Box>
			</CardContent>
		</Card>
	);
}
