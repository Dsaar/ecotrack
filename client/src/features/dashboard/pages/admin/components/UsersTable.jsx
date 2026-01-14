// src/features/dashboard/pages/admin/components/UsersTable.jsx
import { Avatar, IconButton, Stack, Switch, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAvatarSrc, getDisplayName, isSelfUser } from "../utils/userViewHelpers.js";

export default function UsersTable({ rows, currentUser, onToggleAdmin, onDelete }) {
	return (
		<TableContainer sx={{ overflowX: "auto" }}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>
							<b>User</b>
						</TableCell>
						<TableCell>
							<b>Email</b>
						</TableCell>
						<TableCell>
							<b>Phone</b>
						</TableCell>
						<TableCell>
							<b>Admin</b>
						</TableCell>
						<TableCell align="right">
							<b>Delete</b>
						</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{rows.map((u) => {
						const name = getDisplayName(u);
						const isSelf = isSelfUser(currentUser, u);

						return (
							<TableRow key={u._id}>
								<TableCell>
									<Stack direction="row" spacing={1.25} alignItems="center">
										<Avatar src={getAvatarSrc(u)} alt={name} sx={{ width: 30, height: 30 }} />
										<Typography variant="body2" sx={{ fontWeight: 600 }}>
											{name}
										</Typography>
									</Stack>
								</TableCell>
								<TableCell>{u.email}</TableCell>
								<TableCell>{u.phone || "—"}</TableCell>
								<TableCell>
									<Switch checked={!!u.isAdmin} onChange={() => onToggleAdmin(u)} />
								</TableCell>
								<TableCell align="right">
									<Tooltip title={isSelf ? "You can’t delete yourself" : "Delete user"}>
										<span>
											<IconButton onClick={() => onDelete(u)} disabled={isSelf}>
												<DeleteIcon />
											</IconButton>
										</span>
									</Tooltip>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
