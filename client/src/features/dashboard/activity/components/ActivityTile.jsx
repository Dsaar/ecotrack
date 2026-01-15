// client/src/features/dashboard/activity/components/ActivityTile.jsx
import { Box, Chip, Stack, Typography } from "@mui/material";
import TonePanel from "../../../dashboard/components/TonePanel";

export default function ActivityTile({
	tone,
	title,
	category,
	when,
	rightChips = null,
	onClick,
	secondary = null,
}) {
	return (
		<TonePanel
			tone={tone}
			onClick={onClick}
			sx={{
				width: "100%",
				cursor: onClick ? "pointer" : "default",
				p: 2,
				borderRadius: 3,
				transition: "transform 120ms ease, filter 120ms ease",
				"&:hover": onClick
					? { filter: "brightness(1.03)", transform: "translateY(-1px)" }
					: undefined,
			}}
		>
			<Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
				<Box sx={{ minWidth: 0 }}>
					<Stack direction="row" spacing={1} alignItems="center">
						<Typography
							variant="subtitle1"
							sx={{
								fontWeight: 800,
								lineHeight: 1.2,
								whiteSpace: "nowrap",
								overflow: "hidden",
								textOverflow: "ellipsis",
								maxWidth: { xs: 220, sm: 360 },
							}}
							title={title}
						>
							{title}
						</Typography>

						{category && (
							<Chip
								label={category}
								size="small"
								sx={{
									fontSize: 11,
									bgcolor: "rgba(255,255,255,0.55)",
									border: "1px solid rgba(0,0,0,0.08)",
								}}
							/>
						)}
					</Stack>

					<Typography variant="body2" sx={{ opacity: 0.85, mt: 0.6 }}>
						{when}
					</Typography>

					{secondary && (
						<Typography component="div" variant="body2" sx={{ mt: 0.8, opacity: 0.9 }}>
							{secondary}
						</Typography>
					)}
				</Box>

				{rightChips ? (
					<Stack
						direction="row"
						spacing={1}
						alignItems="center"
						justifyContent="flex-end"
						sx={{ flexShrink: 0 }}
					>
						{rightChips}
					</Stack>
				) : null}
			</Stack>
		</TonePanel>
	);
}
