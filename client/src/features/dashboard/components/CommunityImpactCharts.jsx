// src/features/dashboard/components/CommunityImpactCharts.jsx
import {
	Card,
	CardContent,
	Typography,
	Stack,
	Box,
	useTheme,
} from "@mui/material";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Legend,
} from "recharts";

import { useRef } from "react";
import useInView from "../../../shared/hooks/useInView.js";

const CATEGORY_COLORS = [
	"#166534",
	"#22c55e",
	"#16a34a",
	"#84cc16",
	"#22c55e",
	"#4ade80",
];

function CommunityImpactCharts({ impactOverTime, categoryDistribution }) {
	const theme = useTheme();
	const isDark = theme.palette.mode === "dark";

	const lineColor = isDark ? "#4ade80" : "#166534";
	const gridColor = theme.palette.divider;

	// 👇 NEW: Create refs for each chart container
	const lineRef = useRef(null);
	const pieRef = useRef(null);

	// 👇 NEW: Detect when they scroll into view
	const lineVisible = useInView(lineRef);
	const pieVisible = useInView(pieRef);

	return (
		<Stack spacing={3} sx={{ minWidth: 0, width: "100%" }}>
			{/* LINE CHART */}
			<Card sx={{ borderRadius: 4 }}>
				<CardContent>
					<Typography variant="h6" sx={{ mb: 1.5 }}>
						Community impact over time
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
						Eco points accumulated by the whole community each month.
					</Typography>

					<Box
						ref={lineRef}   // 👈 WATCH THIS ELEMENT
						sx={{
							width: "100%",
							height: 260,
							minWidth: 0,
						}}
					>
						{/* 👇 Chart only mounts AFTER visible */}
						{lineVisible && (
							<ResponsiveContainer width="100%" height="100%">
								<LineChart
									data={impactOverTime}
									margin={{ top: 10, right: 20, bottom: 0, left: -15 }}
								>
									<CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
									<XAxis dataKey="month" />
									<YAxis />
									<Tooltip />
									<Line
										type="monotone"
										dataKey="points"
										stroke={lineColor}
										strokeWidth={2.2}
										dot={{ r: 4 }}
										activeDot={{ r: 6 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						)}
					</Box>
				</CardContent>
			</Card>

			{/* PIE CHART */}
			<Card sx={{ borderRadius: 4 }}>
				<CardContent>
					<Typography variant="h6" sx={{ mb: 1.5 }}>
						Missions by category
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
						Share of completed missions across different sustainability areas.
					</Typography>

					<Box
						ref={pieRef} // 👈 WATCH THIS ELEMENT
						sx={{
							width: "100%",
							height: 260,
							minWidth: 0,
						}}
					>
						{/* 👇 Chart only mounts AFTER visible */}
						{pieVisible && (
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={categoryDistribution}
										dataKey="value"
										nameKey="name"
										innerRadius={50}
										outerRadius={80}
										paddingAngle={3}
									>
										{categoryDistribution.map((entry, index) => (
											<Cell
												key={`cell-${entry.name}`}
												fill={
													CATEGORY_COLORS[index % CATEGORY_COLORS.length]
												}
											/>
										))}
									</Pie>
									<Tooltip />
									<Legend
										verticalAlign="middle"
										align="right"
										layout="vertical"
										wrapperStyle={{ fontSize: 12 }}
									/>
								</PieChart>
							</ResponsiveContainer>
						)}
					</Box>
				</CardContent>
			</Card>
		</Stack>
	);
}

export default CommunityImpactCharts;
