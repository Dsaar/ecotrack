// src/features/dashboard/pages/admin/components/UsersPaginationBar.jsx
import { Box, FormControl, InputLabel, MenuItem, Pagination, Select, Stack, Typography } from "@mui/material";
import { PAGE_SIZE_OPTIONS } from "../utils/userViewHelpers.js";

export default function UsersPaginationBar({
	loading,
	total,
	startIndex,
	endIndex,
	q,
	query,
	pageSize,
	setPageSize,
	pageCount,
	safePage,
	setPage,
}) {
	if (loading || total <= 0) return null;

	return (
		<Stack
			direction={{ xs: "column", sm: "row" }}
			alignItems={{ xs: "stretch", sm: "center" }}
			justifyContent="space-between"
			spacing={1.25}
			sx={{ mb: 1.5 }}
		>
			<Typography variant="caption" color="text.secondary">
				Showing {startIndex + 1}-{endIndex} of {total}
				{q ? ` for “${query}”` : ""}
			</Typography>

			<Stack
				direction={{ xs: "column", sm: "row" }}
				spacing={1.25}
				alignItems={{ xs: "stretch", sm: "center" }}
				justifyContent="flex-end"
			>
				<FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 160 } }}>
					<InputLabel id="admin-users-page-size-label">Per page</InputLabel>
					<Select
						labelId="admin-users-page-size-label"
						value={pageSize}
						label="Per page"
						onChange={(e) => setPageSize(Number(e.target.value))}
					>
						{PAGE_SIZE_OPTIONS.map((n) => (
							<MenuItem key={n} value={n}>
								{n}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<Box sx={{ display: "flex", justifyContent: { xs: "center", sm: "flex-end" } }}>
					<Pagination
						count={pageCount}
						page={safePage}
						onChange={(_, value) => setPage(value)}
						color="primary"
						shape="rounded"
					/>
				</Box>
			</Stack>
		</Stack>
	);
}
