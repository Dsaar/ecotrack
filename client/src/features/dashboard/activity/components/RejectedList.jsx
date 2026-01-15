// client/src/features/dashboard/activity/components/RejectedList.jsx
import { Box, Chip, Stack, Typography } from "@mui/material";
import ActivityTile from "./ActivityTile.jsx";
import { formatDateTime, getRejectionReason, missionFromItem } from "../utils/activityHelpers.js";

export default function RejectedList({ items, onOpenMission }) {
	return (
		<>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
				Rejected submissions (with reason)
			</Typography>

			{items.length === 0 ? (
				<Typography variant="body2" color="text.secondary">
					No rejected submissions. Nice 👌
				</Typography>
			) : (
				<Stack spacing={1.5}>
					{items.slice(0, 10).map((s) => {
						const mission = missionFromItem(s);
						const title = mission.title || "Mission";
						const category = mission.category || "General";
						const when = formatDateTime(s.createdAt);
						const reason = getRejectionReason(s).trim();

						return (
							<ActivityTile
								key={s._id}
								tone="rejected"
								title={title}
								category={category}
								when={when}
								onClick={() => mission._id && onOpenMission(mission._id)}
								secondary={
									<Box>
										<Typography variant="body2" sx={{ fontWeight: 800, opacity: 0.95 }}>
											Reason:
										</Typography>
										<Typography variant="body2" sx={{ opacity: 0.9 }}>
											{reason || "No reason provided."}
										</Typography>
									</Box>
								}
								rightChips={
									<Chip
										label="Rejected"
										size="small"
										variant="outlined"
										color="error"
										sx={{ fontSize: 11, bgcolor: "rgba(255,255,255,0.35)" }}
									/>
								}
							/>
						);
					})}
				</Stack>
			)}
		</>
	);
}
