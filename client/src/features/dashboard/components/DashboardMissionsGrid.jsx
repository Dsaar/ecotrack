// src/features/dashboard/components/DashboardMissionsGrid.jsx
import {
	Box,
	Card,
	CardContent,
	Typography,
	Button,
	Stack,
	Chip,
	IconButton,
	Tooltip,
} from "@mui/material";

import PublicIcon from "@mui/icons-material/Public";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DashboardMissionsGrid({
	missions,
	isAdmin,
	onOpenDetails,
	onTogglePublish,
	onEditPage,
	onDelete,
	FavoriteButtonComponent,
}) {
	if (!missions || missions.length === 0) {
		return (
			<Typography variant="body2" color="text.secondary">
				No missions found.
			</Typography>
		);
	}

	// ✅ Hard guarantees (same for every card)
	const CARD_H = 360;   // total card height
	const IMAGE_H = 150;  // image area height
	const BTN_H = 44;     // button height

	// helper: clamp text to N lines (prevents height changes)
	const clamp = (lines) => ({
		display: "-webkit-box",
		WebkitBoxOrient: "vertical",
		WebkitLineClamp: lines,
		overflow: "hidden",
	});

	return (
		<Box
			sx={{
				// ✅ Use CSS Grid: each cell same width logic, independent of row stretch
				display: "grid",
				gap: 10,
				gridTemplateColumns: {
					xs: "1fr",
					sm: "repeat(2, minmax(0, 1fr))",
					md: "repeat(3, minmax(0, 1fr))",
				},
				alignItems: "start",
			}}
		>
			{missions.map((mission) => (
				<Card
					key={mission._id}
					variant="outlined"
					onClick={() => onOpenDetails(mission._id)}
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
				>
					{/* ✅ Fixed image frame (always same height) */}
					<Box
						sx={{
							height: IMAGE_H,
							width: "100%",
							bgcolor: "action.hover",
							backgroundImage: mission.imageUrl ? `url(${mission.imageUrl})` : "none",
							backgroundSize: "cover",
							backgroundPosition: "center",
							flexShrink: 0,
						}}
					/>

					{/* ✅ Content area: forced to fit */}
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
						{/* Title + actions (fixed height via clamp) */}
						<Box
							sx={{
								display: "flex",
								alignItems: "flex-start",
								justifyContent: "space-between",
								gap: 1,
							}}
						>
							<Typography
								variant="subtitle1"
								sx={{
									fontWeight: 700,
									lineHeight: 1.2,
									...clamp(2), // ✅ title never expands card
									minHeight: 42, // ✅ guarantees same title block height
								}}
							>
								{mission.title || "Untitled mission"}
							</Typography>

							<Stack direction="row" spacing={0.25} alignItems="center" sx={{ flexShrink: 0 }}>
								{FavoriteButtonComponent && <FavoriteButtonComponent missionId={mission._id} />}

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

										<Tooltip title="Delete mission">
											<IconButton
												size="small"
												onClick={(e) => {
													e.stopPropagation();
													onDelete?.(mission);
												}}
											>
												<DeleteIcon fontSize="small" />
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
						</Box>

						{/* Chips row (fixed height) */}
						<Box sx={{ minHeight: 34, display: "flex", alignItems: "center" }}>
							<Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
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
									<Chip size="small" label="Unpublished" variant="outlined" color="warning" />
								)}
							</Stack>
						</Box>

						{/* Summary (fixed block height) */}
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{
								...clamp(2),
								minHeight: 40, // ✅ same summary area even if short
							}}
						>
							{mission.summary || ""}
						</Typography>

						{/* Button pinned to bottom, fixed height */}
						<Box sx={{ mt: "auto" }}>
							<Button
								fullWidth
								variant="contained"
								onClick={(e) => {
									e.stopPropagation();
									onOpenDetails(mission._id);
								}}
								sx={{
									height: BTN_H,
									textTransform: "none",
									bgcolor: "#166534",
									"&:hover": { bgcolor: "#14532d" },
									borderRadius: 999,
								}}
							>
								View details
							</Button>
						</Box>
					</CardContent>
				</Card>
			))}
		</Box>
	);
}
