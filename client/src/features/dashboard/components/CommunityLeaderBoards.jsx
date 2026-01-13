// src/features/dashboard/components/CommunityLeaderboards.jsx
import {
	Avatar,
	Box,
	Card,
	CardContent,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Paper,
} from "@mui/material";
import { useUser } from "../../../app/providers/UserProvider.jsx";

function LeaderTable({ title, items, valueKey, valueSuffix, currentUserId }) {
	return (
		<Box sx={{ flex: 1, minWidth: 0 }}>
			<Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
				{title}
			</Typography>

			<TableContainer
				component={Paper}
				variant="outlined"
				sx={{
					borderRadius: 1,
					overflowX: "hidden", // ✅ no sideways scrolling
				}}
			>
				<Table
					size="small"
					sx={{
						width: "100%",
						tableLayout: "fixed", // ✅ forces columns to fit container width
						"& td, & th": {
							px: { xs: 1.0, sm: 1.5 }, // ✅ tighter padding on mobile
							py: { xs: 0.6, sm: 0.75 },
						},
					}}
				>
					<TableHead>
						<TableRow>
							<TableCell
								sx={{
									width: 44, // ✅ tighter rank column
									whiteSpace: "nowrap",
									fontWeight: 600,
								}}
							>
								#
							</TableCell>

							<TableCell
								sx={{
									// ✅ this column will take remaining space
									minWidth: 0,
									fontWeight: 600,
								}}
							>
								User
							</TableCell>

							<TableCell
								align="right"
								sx={{
									width: { xs: 76, sm: 92 }, // ✅ tight value column
									whiteSpace: "nowrap",
									fontWeight: 600,
								}}
							>
								{valueKey === "points" ? "Points" : "Missions"}
							</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{(items || []).slice(0, 10).map((item, index) => {
							const isMe =
								item.userId && currentUserId && item.userId === currentUserId;

							return (
								<TableRow
									key={`${title}-${item.userId || item.name}-${index}`}
									sx={{
										bgcolor: isMe ? "success.main" : "transparent",
										"& td": {
											color: isMe ? "common.white" : "text.primary",
											borderBottomColor: isMe
												? "rgba(255,255,255,0.25)"
												: "divider",
										},
									}}
								>
									<TableCell sx={{ whiteSpace: "nowrap" }}>
										{index + 1}
									</TableCell>

									<TableCell sx={{ minWidth: 0 }}>
										<Stack
											direction="row"
											spacing={1}
											alignItems="center"
											sx={{ minWidth: 0 }}
										>
											<Avatar
												src={item.avatarUrl || ""}
												alt={item.name || "User"}
												sx={{
													width: { xs: 24, sm: 28 }, // ✅ smaller on mobile
													height: { xs: 24, sm: 28 },
													flexShrink: 0,
												}}
												imgProps={{
													referrerPolicy: "no-referrer",
												}}
											/>
											<Typography
												variant="body2"
												sx={{
													fontWeight: 500,
													minWidth: 0,
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap", // ✅ prevents widening
												}}
											>
												{item.name}
											</Typography>
										</Stack>
									</TableCell>

									<TableCell
										align="right"
										sx={{
											fontWeight: 600,
											whiteSpace: "nowrap",
										}}
									>
										{item[valueKey]}
										{valueSuffix ? ` ${valueSuffix}` : ""}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
}

function CommunityLeaderboards({ leadersByPoints = [], leadersByMissions = [] }) {
	const { user } = useUser();
	const currentUserId = user?.id || user?._id;

	return (
		<Card sx={{ borderRadius: 2 }}>
			<CardContent sx={{ pb: 2 }}>
				<Typography variant="h6" sx={{ mb: 1 }}>
					Leaderboards
				</Typography>

				{/* ✅ Mobile stacks vertically; desktop side-by-side */}
				<Stack direction={{ xs: "column", md: "row" }} spacing={2.5}>
					<LeaderTable
						title="Top eco points"
						items={leadersByPoints}
						valueKey="points"
						valueSuffix="pts"
						currentUserId={currentUserId}
					/>

					<LeaderTable
						title="Most missions completed"
						items={leadersByMissions}
						valueKey="missions"
						valueSuffix=""
						currentUserId={currentUserId}
					/>
				</Stack>
			</CardContent>
		</Card>
	);
}

export default CommunityLeaderboards;
