// client/src/features/dashboard/activity/components/ApprovedList.jsx
import { Chip, Stack, Typography } from "@mui/material";
import ActivityTile from "./ActivityTile.jsx";
import { formatDateTime, missionFromItem } from "../utils/activityHelpers.js";

export default function ApprovedList({ checkins, onOpenMission }) {
	return (
		<>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
				Recent check-ins (approved)
			</Typography>

			{checkins.length === 0 ? (
				<Typography variant="body2" color="text.secondary">
					No approved missions yet. Once a submission is approved, it will appear here.
				</Typography>
			) : (
				<Stack spacing={1.5}>
					{checkins.slice(0, 10).map((c) => {
						const mission = missionFromItem(c);
						const title = mission.title || "Mission";
						const category = mission.category || "General";
						const when = formatDateTime(c.createdAt);
						const pts = c.points ?? 0;

						return (
							<ActivityTile
								key={c._id}
								tone="green"
								title={title}
								category={category}
								when={when}
								onClick={() => mission._id && onOpenMission(mission._id)}
								rightChips={
									<>
										<Chip
											label={`+${pts} pts`}
											size="small"
											sx={{
												fontSize: 11,
												bgcolor: "rgba(255,255,255,0.55)",
												border: "1px solid rgba(0,0,0,0.08)",
											}}
										/>
										<Chip
											label="Approved"
											size="small"
											variant="outlined"
											color="success"
											sx={{ fontSize: 11, bgcolor: "rgba(255,255,255,0.35)" }}
										/>
									</>
								}
							/>
						);
					})}
				</Stack>
			)}
		</>
	);
}
