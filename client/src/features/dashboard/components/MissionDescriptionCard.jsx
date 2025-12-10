// src/features/missions/components/MissionDescriptionCard.jsx
import {
	Box,
	Card,
	CardContent,
	Chip,
	Stack,
	Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import FavoriteButton from "../../missions/components/FavoriteButton";

function MissionDescriptionCard({ mission }) {
	const navigate = useNavigate();
	const location = useLocation();

	if (!mission) return null;

	const {
		_id,
		title,
		summary,
		description,
		category,
		difficulty,
		estImpact,
	} = mission;

	// Decide where to navigate:
	// - in dashboard → /dashboard/missions/:id
	// - public pages → /missions/:id
	const isDashboard = location.pathname.startsWith("/dashboard");
	const detailsPath = isDashboard
		? `/dashboard/missions/${_id}`
		: `/missions/${_id}`;

	const handleCardClick = () => {
		navigate(detailsPath);
	};

	return (
		<Card
			onClick={handleCardClick}
			sx={{
				borderRadius: 4,
				cursor: "pointer",
				"&:hover": {
					boxShadow: 4,
				},
			}}
		>
			<CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				{/* Top row: title / chips / favorite */}
				<Stack
					direction="row"
					alignItems="flex-start"
					justifyContent="space-between"
					spacing={2}
				>
					<Box>
						<Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
							{title || "Untitled mission"}
						</Typography>

						<Stack direction="row" spacing={1} flexWrap="wrap">
							{category && (
								<Chip
									label={category}
									size="small"
									variant="outlined"
									color="default"
								/>
							)}
							{difficulty && (
								<Chip
									label={difficulty}
									size="small"
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
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ mt: 0.75 }}
							>
								{summary}
							</Typography>
						)}
					</Box>

					{/* ⭐ favorite button – click doesn’t trigger navigation because
              FavoriteButton does e.stopPropagation() inside */}
					<FavoriteButton missionId={_id} />
				</Stack>

				{/* Image placeholder (as you had it) */}
				<Box
					sx={{
						mt: 1,
						width: "100%",
						borderRadius: 3,
						bgcolor: "action.hover",
						minHeight: 120,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "text.secondary",
						fontSize: 14,
					}}
				>
					Mission visual will go here
				</Box>

				{/* Description section */}
				<Box sx={{ mt: 1 }}>
					<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
						What you&apos;ll do
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ whiteSpace: "pre-line" }}
					>
						{description || "No description provided for this mission yet."}
					</Typography>
				</Box>
			</CardContent>
		</Card>
	);
}

export default MissionDescriptionCard;
