// src/features/dashboard/components/CommunityImpactCard.jsx
import {
	Box,
	Card,
	CardContent,
	Stack,
	Typography,
} from "@mui/material";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// 🔹 Placeholder community stats — later you can fetch from backend
const mockCommunityStats = {
	totalEcoPoints: 12840,
	totalSubmissions: 563,
	totalUsers: 74,
	categoryBreakdown: [
		{ category: "Home", submissions: 180 },
		{ category: "Transport", submissions: 140 },
		{ category: "Food", submissions: 110 },
		{ category: "Energy", submissions: 80 },
		{ category: "Waste", submissions: 53 },
	],
};

const barData = {
	labels: mockCommunityStats.categoryBreakdown.map((c) => c.category),
	datasets: [
		{
			label: "Submissions per category",
			data: mockCommunityStats.categoryBreakdown.map((c) => c.submissions),
		},
	],
};

const barOptions = {
	responsive: true,
	plugins: {
		legend: {
			position: "bottom",
		},
	},
	scales: {
		y: {
			beginAtZero: true,
		},
	},
};

function CommunityImpactCard() {
	const { totalEcoPoints, totalSubmissions, totalUsers } = mockCommunityStats;

	return (
		<Card sx={{ borderRadius: 4 }}>
			<CardContent>
				<Typography variant="h6" sx={{ mb: 2 }}>
					EcoTrack community impact
				</Typography>

				{/* Top numbers */}
				<Stack
					direction={{ xs: "column", sm: "row" }}
					spacing={3}
					sx={{ mb: 3 }}
				>
					<Box>
						<Typography
							variant="h5"
							sx={{ fontWeight: 600, color: "#166534" }}
						>
							{totalEcoPoints.toLocaleString()}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Total eco points
						</Typography>
					</Box>

					<Box>
						<Typography variant="h5" sx={{ fontWeight: 600 }}>
							{totalSubmissions.toLocaleString()}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Mission submissions
						</Typography>
					</Box>

					<Box>
						<Typography variant="h5" sx={{ fontWeight: 600 }}>
							{totalUsers}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Active members
						</Typography>
					</Box>
				</Stack>

				{/* Bar chart */}
				<Box sx={{ height: 260 }}>
					<Bar data={barData} options={barOptions} />
				</Box>

				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ mt: 2 }}
				>
					These numbers show how the whole EcoTrack community is contributing.
					Later we can connect this to real backend-side aggregates of
					submissions and mission impact.
				</Typography>
			</CardContent>
		</Card>
	);
}

export default CommunityImpactCard;
