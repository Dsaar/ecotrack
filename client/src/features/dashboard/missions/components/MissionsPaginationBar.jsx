// client/src/features/dashboard/missions/components/MissionsPaginationBar.jsx
import {
	Box,
	FormControl,
	InputLabel,
	MenuItem,
	Pagination,
	Select,
	Stack,
	Typography,
} from "@mui/material";
import { PAGE_SIZE_OPTIONS } from "../utils/missionsHelpers.js";

export default function MissionsPaginationBar({
	total,
	startIndex,
	endIndex,
	pageCount,
	safePage,
	pageSize,
	setPageSize,
	setPage,
}) {
	return (
		<Stack
			direction={{ xs: "column", sm: "row" }}
			spacing={2}
			alignItems={{ xs: "stretch", sm: "center" }}
			justifyContent="space-between"
			sx={{ mb: 2 }}
		>
			<Typography variant="body2" color="text.secondary">
				{total === 0 ? "No missions to show." : `Showing ${startIndex + 1}-${endIndex} of ${total}`}
			</Typography>

			<Stack
				direction={{ xs: "column", sm: "row" }}
				spacing={1.5}
				alignItems={{ xs: "stretch", sm: "center" }}
				justifyContent="flex-end"
				sx={{ width: { xs: "100%", sm: "auto" } }}
			>
				<FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 160 } }}>
					<InputLabel id="page-size-label">Per page</InputLabel>
					<Select
						labelId="page-size-label"
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

				<Box
					sx={{
						display: "flex",
						justifyContent: { xs: "center", sm: "flex-end" },
						width: { xs: "100%", sm: "auto" },
					}}
				>
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
