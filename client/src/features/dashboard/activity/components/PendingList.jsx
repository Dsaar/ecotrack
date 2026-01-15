// client/src/features/dashboard/activity/components/PendingList.jsx
import { Chip, Stack, Typography } from "@mui/material";
import ActivityTile from "./ActivityTile.jsx";
import { formatDateTime, missionFromItem } from "../utils/activityHelpers.js";

export default function PendingList({ items, onOpenMission }) {
	return (
		<>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
				Submissions waiting for review
			</Typography>

			{items.length === 0 ? (
				<Typography variant="body2" color="text.secondary">
					No pending submissions right now.
				</Typography>
			) : (
				<Stack spacing={1.5}>
					{items.slice(0, 10).map((s) => {
						const mission = missionFromItem(s);
						const title = mission.title || "Mission";
						const category = mission.category || "General";
						const when = formatDateTime(s.createdAt);

						return (
							<ActivityTile
								key={s._id}
								tone="amber"
								title={title}
								category={category}
								when={when}
								onClick={() => mission._id && onOpenMission(mission._id)}
								rightChips={
									<Chip
										label="Pending"
										size="small"
										variant="outlined"
										color="warning"
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
