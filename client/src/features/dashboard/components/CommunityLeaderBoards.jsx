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

function LeaderList({ title, items, primaryKey, secondarySuffix }) {
	return (
		<Stack spacing={1.5}>
			<Typography variant="subtitle2" color="text.secondary">
				{title}
			</Typography>
			<List dense sx={{ pt: 0 }}>
				{items.map((item, index) => (
					<ListItem
						key={`${title}-${item.name}-${index}`}
						sx={{ px: 0, py: 0.3 }}
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
										{item[primaryKey]}
										{secondarySuffix ? ` ${secondarySuffix}` : ""}
									</span>
								</>
							}
						/>
					</ListItem>
				))}
			</List>
		</Stack>
	);
}

function CommunityLeaderboards({ leadersByPoints, leadersByMissions }) {
	return (
		<Card sx={{ borderRadius: 4 }}>
			<CardContent>
				<Typography variant="h6" sx={{ mb: 2 }}>
					Leaderboards
				</Typography>

				<Stack
					direction={{ xs: "column", sm: "row" }}
					spacing={3}
					alignItems="flex-start"
				>
					<LeaderList
						title="Top eco points"
						items={leadersByPoints}
						primaryKey="points"
						secondarySuffix="pts"
					/>
					<LeaderList
						title="Most missions completed"
						items={leadersByMissions}
						primaryKey="missions"
						secondarySuffix=""
					/>
				</Stack>
			</CardContent>
		</Card>
	);
}

export default CommunityLeaderboards;
