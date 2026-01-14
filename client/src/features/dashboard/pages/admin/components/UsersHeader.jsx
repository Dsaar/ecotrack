// src/features/dashboard/pages/admin/components/UsersHeader.jsx
import { Stack, Typography } from "@mui/material";

export default function UsersHeader({ loading, filteredCount, totalCount, q, query }) {
	return (
		<Stack spacing={0.5} sx={{ mb: 2 }}>
			<Typography variant="h4" sx={{ fontWeight: 700 }}>
				Admin CRM
			</Typography>
			<Typography variant="body2" color="text.secondary">
				Search by name, email, phone, or “admin”.
			</Typography>

			{!loading && (
				<Typography variant="caption" color="text.secondary">
					Showing {filteredCount} of {totalCount} users{q ? ` for “${query}”` : ""}
				</Typography>
			)}
		</Stack>
	);
}
