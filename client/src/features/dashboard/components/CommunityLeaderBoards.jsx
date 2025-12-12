// src/features/dashboard/components/CommunityLeaderboards.jsx
import {
	Card,
	CardContent,
	Typography,
	Stack,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import { useUser } from "../../../app/providers/UserProvider.jsx";

function LeaderList({ title, items, primaryKey, secondarySuffix, currentUserId }) {
	return (
		<Stack spacing={1.5}>
			<Typography variant="subtitle2" color="text.secondary">{title}</Typography>

			<List dense sx={{ pt: 0 }}>
				{items.map((item, index) => {
					const isMe = item.userId && currentUserId && item.userId === currentUserId;

					return (
						<ListItem
							key={`${title}-${item.userId || item.name}-${index}`}
							sx={{
								px: 3,
								py: 0.3,
								borderRadius: 2,
								bgcolor: isMe ? "success.main" : "transparent",
							}}
						>
							<ListItemText
								primaryTypographyProps={{
									variant: "body2",
									sx: { display: "flex", justifyContent: "space-between" },
								}}
								primary={
									<>
										<span>
											{index + 1}. {item.name}
										</span>
										<span style={{ fontWeight: 500 }}>
											{item[primaryKey]}{secondarySuffix ? ` ${secondarySuffix}` : ""}
										</span>
									</>
								}
							/>
						</ListItem>
					);
				})}
			</List>
		</Stack>
	);
}


function CommunityLeaderboards({ leadersByPoints, leadersByMissions }) {
	const { user } = useUser();
	const currentUserId = user?.id || user?._id; // depending on your user shape

	return (
		<Card sx={{ borderRadius: 4 }}>
			<CardContent>
				<Typography variant="h6" sx={{ mb: 2 }}>Leaderboards</Typography>

				<Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="flex-start">
					<LeaderList
						title="Top eco points"
						items={leadersByPoints}
						primaryKey="points"
						secondarySuffix="pts"
						currentUserId={currentUserId}
					/>
					<LeaderList
						title="Most missions completed"
						items={leadersByMissions}
						primaryKey="missions"
						secondarySuffix=""
						currentUserId={currentUserId}
					/>
				</Stack>
			</CardContent>
		</Card>
	);
}

export default CommunityLeaderboards;
