// src/features/dashboard/pages/admin/components/UsersMobileList.jsx
import { Avatar, Box, Card, CardContent, Divider, IconButton, Stack, Switch, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAvatarSrc, getDisplayName, isSelfUser } from "../utils/userViewHelpers.js";

export default function UsersMobileList({ rows, currentUser, onToggleAdmin, onDelete }) {
	return (
		<Stack spacing={1.25}>
			{rows.map((u) => {
				const name = getDisplayName(u);
				const isSelf = isSelfUser(currentUser, u);

				return (
					<Card key={u._id} variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
						<CardContent sx={{ p: 1.5 }}>
							<Stack spacing={1}>
								<Stack direction="row" alignItems="center" justifyContent="space-between">
									<Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
										<Avatar
											src={getAvatarSrc(u)}
											alt={name}
											sx={{ width: 34, height: 34, flexShrink: 0 }}
										/>
										<Box sx={{ minWidth: 0 }}>
											<Typography sx={{ fontWeight: 800 }} noWrap>
												{name}
											</Typography>
											<Typography variant="body2" color="text.secondary" noWrap>
												{u.email}
											</Typography>
										</Box>
									</Stack>

									<Tooltip title={isSelf ? "You can’t delete yourself" : "Delete user"}>
										<span>
											<IconButton onClick={() => onDelete(u)} disabled={isSelf} size="small">
												<DeleteIcon fontSize="small" />
											</IconButton>
										</span>
									</Tooltip>
								</Stack>

								{u.phone ? (
									<Typography variant="body2" color="text.secondary">
										Phone: {u.phone}
									</Typography>
								) : null}

								<Divider />

								<Stack direction="row" alignItems="center" justifyContent="space-between">
									<Typography variant="body2" sx={{ fontWeight: 700 }}>
										Admin
									</Typography>
									<Switch checked={!!u.isAdmin} onChange={() => onToggleAdmin(u)} />
								</Stack>
							</Stack>
						</CardContent>
					</Card>
				);
			})}
		</Stack>
	);
}
