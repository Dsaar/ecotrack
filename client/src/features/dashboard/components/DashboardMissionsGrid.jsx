// src/features/dashboard/components/DashboardMissionsGrid.jsx
import {
	Box,
	Card,
	CardContent,
	Typography,
	Grid,
	Button,
	Stack,
	Chip,
	IconButton,
	Tooltip,
} from "@mui/material";

import PublicIcon from "@mui/icons-material/Public";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";

export default function DashboardMissionsGrid({
	missions,
	isAdmin,
	onOpenDetails,
	onTogglePublish,
	onEditPage,
	FavoriteButtonComponent,
}) {
	if (!missions || missions.length === 0) {
		return (
			<Typography variant="body2" color="text.secondary">
				No missions found.
			</Typography>
		);
	}

	return (
		<Grid container spacing={2}>
			{missions.map((mission) => (
				<Grid item xs={12} sm={6} md={4} key={mission._id}>
					<Card
						variant="outlined"
						onClick={() => onOpenDetails(mission._id)}
						sx={{
							height: "100%",
							display: "flex",
							flexDirection: "column",
							cursor: "pointer",
							"&:hover": { boxShadow: 3 },
						}}
					>
						{/* mission image */}
						<Box
							sx={{
								height: 140,
								bgcolor: "action.hover",
								backgroundImage: mission.imageUrl ? `url(${mission.imageUrl})` : "none",
								backgroundSize: "cover",
								backgroundPosition: "center",
							}}
						/>

						<CardContent sx={{ flexGrow: 1 }}>
							<Stack
								direction="row"
								justifyContent="space-between"
								alignItems="flex-start"
								sx={{ mb: 1 }}
								spacing={1}
							>
								<Typography variant="subtitle1" sx={{ fontWeight: 600, pr: 1 }}>
									{mission.title}
								</Typography>

								<Stack direction="row" spacing={0.5} alignItems="center">
									{/* Favorites */}
									<FavoriteButtonComponent missionId={mission._id} />

									{/* Admin actions */}
									{isAdmin && (
										<>
											<Tooltip title="Edit mission">
												<IconButton
													size="small"
													onClick={(e) => {
														e.stopPropagation();
														onEditPage(mission._id);
													}}
												>
													<EditIcon fontSize="small" />
												</IconButton>
											</Tooltip>

											<Tooltip
												title={
													mission.isPublished
														? "Unpublish (hide from public)"
														: "Publish (show on public)"
												}
											>
												<IconButton
													size="small"
													onClick={(e) => {
														e.stopPropagation();
														onTogglePublish(mission);
													}}
												>
													{mission.isPublished ? (
														<VisibilityOffIcon fontSize="small" />
													) : (
														<PublicIcon fontSize="small" />
													)}
												</IconButton>
											</Tooltip>
										</>
									)}
								</Stack>
							</Stack>

							<Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap">
								{mission.category && (
									<Chip size="small" label={mission.category} variant="outlined" />
								)}

								{mission.difficulty && (
									<Chip
										size="small"
										label={mission.difficulty}
										variant="outlined"
										color={
											mission.difficulty === "Easy"
												? "success"
												: mission.difficulty === "Hard"
													? "error"
													: "warning"
										}
									/>
								)}

								{isAdmin && mission.isPublished === false && (
									<Chip
										size="small"
										label="Unpublished"
										variant="outlined"
										color="warning"
									/>
								)}
							</Stack>

							<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
								{mission.summary}
							</Typography>
						</CardContent>

						<Box sx={{ p: 2, pt: 0 }}>
							<Button
								size="small"
								variant="contained"
								onClick={(e) => {
									e.stopPropagation();
									onOpenDetails(mission._id);
								}}
								sx={{
									textTransform: "none",
									bgcolor: "#166534",
									"&:hover": { bgcolor: "#14532d" },
								}}
							>
								View details
							</Button>
						</Box>
					</Card>
				</Grid>
			))}
		</Grid>
	);
}
