// src/pages/HomePage.jsx

import {
	Box,
	Button,
	Container,
	Typography,
	Stack,
	Card,
	CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";


function HomePage() {
	const navigate = useNavigate();

	return (
		<Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb" }}>
			{/* Global header with logo */}

			{/* Hero + preview */}
			<Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
						gap: 6,
						alignItems: "center",
					}}
				>
					{/* LEFT: Hero text */}
					<Box>
						<Typography
							variant="h2"
							sx={{
								fontSize: { xs: "2.1rem", md: "3rem" },
								fontWeight: 700,
								mb: 2,
								lineHeight: 1.1,
							}}
						>
							See your impact.
							<br />
							One mission at a time.
						</Typography>

						<Typography
							variant="body1"
							sx={{
								fontSize: "1.05rem",
								color: "text.secondary",
								maxWidth: 520,
								mb: 4,
							}}
						>
							Take on eco-friendly missions, track your progress, and make a
							difference for the planet.
						</Typography>

						<Stack direction="row" spacing={2} flexWrap="wrap">
							<Button
								variant="contained"
								size="large"
								sx={{
									textTransform: "none",
									bgcolor: "#166534",
									"&:hover": { bgcolor: "#14532d" },
									
								}}
								onClick={() => navigate("/register")}

							>
								Get Started
							</Button>
							<Button
								variant="text"
								size="large"
								sx={{ textTransform: "none", color: "#166534" }}
								
							>
								Browse missions →
							</Button>
						</Stack>
					</Box>

					{/* RIGHT: Community dashboard preview */}
					<Card
						elevation={0}
						sx={{
							borderRadius: 3,
							border: "1px solid #e5e7eb",
							bgcolor: "white",
							px: 3,
							py: 2.5,
						}}
					>
						<CardContent sx={{ p: 0 }}>
							{/* Stats row */}
							<Stack direction="row" spacing={2} sx={{ mb: 2 }}>
								<Box
									sx={{
										flex: 1,
										borderRadius: 2,
										bgcolor: "#dcfce7",
										p: 2,
									}}
								>
									<Typography variant="body2" sx={{ mb: 0.5 }}>
										CO₂ Reduced
									</Typography>
									<Typography variant="h6" sx={{ fontWeight: 700 }}>
										−210 kg
									</Typography>
								</Box>

								<Box
									sx={{
										flex: 1,
										borderRadius: 2,
										bgcolor: "#dbeafe",
										p: 2,
									}}
								>
									<Typography variant="body2" sx={{ mb: 0.5 }}>
										Water Saved
									</Typography>
									<Typography variant="h6" sx={{ fontWeight: 700 }}>
										3150 liters
									</Typography>
								</Box>
							</Stack>

							{/* Progress bar */}
							<Box sx={{ mt: 1 }}>
								<Typography variant="subtitle2" sx={{ mb: 1 }}>
									Community Missions Progress
								</Typography>

								<Box
									sx={{
										height: 8,
										borderRadius: 999,
										bgcolor: "#e5e7eb",
										overflow: "hidden",
										mb: 1,
									}}
								>
									<Box
										sx={{
											width: "70%",
											height: "100%",
											bgcolor: "#166534",
										}}
									/>
								</Box>

								<Typography variant="body2" sx={{ color: "text.secondary" }}>
									Sign in to see your personal impact.
								</Typography>
							</Box>
						</CardContent>
					</Card>
				</Box>
			</Container>
		</Box>
	);
}

export default HomePage;
