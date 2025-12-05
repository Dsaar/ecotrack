// src/features/landing/pages/HomePage.jsx
import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	LinearProgress,
	Stack,
	Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function HomePage() {
	const navigate = useNavigate();

	return (
		<Box
			sx={{
				minHeight: "calc(100vh - 300px)", // header + footer space
				bgcolor: "background.default",
				display: "flex",
				alignItems: "center",
			}}
		>
			<Container maxWidth="lg">
				<Stack
					direction={{ xs: "column", md: "row" }}
					spacing={{ xs: 6, md: 8 }}
					alignItems="center"
				>
					{/* Left: Hero text */}
					<Box sx={{ flex: 1 }}>
						<Typography
							component="h1"
							variant="h3"
							sx={{
								fontWeight: 700,
								letterSpacing: -0.5,
								mb: 2,
							}}
						>
							See your impact.
							<br />
							One mission at a time.
						</Typography>

						<Typography
							variant="body1"
							color="text.secondary"
							sx={{ maxWidth: 480, mb: 3 }}
						>
							Take on eco-friendly missions, track your progress, and make a
							difference for the planet.
						</Typography>

						<Stack direction="row" spacing={2}>
							<Button
								variant="contained"
								sx={{
									textTransform: "none",
									px: 3.5,
									py: 1.2,
									bgcolor: "#166534",
									"&:hover": { bgcolor: "#14532d" },
								}}
								onClick={() => navigate("/register")}
							>
								Get Started
							</Button>
							<Button
								variant="text"
								sx={{ textTransform: "none" }}
								onClick={() => navigate("/missions")}
							>
								Browse missions →
							</Button>
						</Stack>
					</Box>

					{/* Right: Community impact card */}
					<Box sx={{ flex: 1, width: "100%" }}>
						<Card
							elevation={0}
							sx={{
								borderRadius: 4,
								border: "1px solid",
								borderColor: "divider",
								bgcolor: "background.paper",
							}}
						>
							<CardContent sx={{ p: 4 }}>
								<Typography
									variant="body2"
									color="text.secondary"
									sx={{ mb: 2 }}
								>
									Community impact (demo data)
								</Typography>

								<Stack
									direction={{ xs: "column", sm: "row" }}
									spacing={2}
									sx={{ mb: 3 }}
								>
									<Box
										sx={{
											flex: 1,
											p: 2,
											borderRadius: 3,
											bgcolor: "success.light",
											color: "success.contrastText",
										}}
									>
										<Typography variant="caption">CO₂ Reduced</Typography>
										<Typography
											variant="h5"
											sx={{ fontWeight: 700, mt: 0.5 }}
										>
											–210 kg
										</Typography>
									</Box>

									<Box
										sx={{
											flex: 1,
											p: 2,
											borderRadius: 3,
											bgcolor: "info.light",
											color: "info.contrastText",
										}}
									>
										<Typography variant="caption">Water Saved</Typography>
										<Typography
											variant="h5"
											sx={{ fontWeight: 700, mt: 0.5 }}
										>
											3150 liters
										</Typography>
									</Box>
								</Stack>

								<Typography
									variant="body2"
									sx={{ fontWeight: 500, mb: 1 }}
								>
									Community Missions Progress
								</Typography>
								<LinearProgress
									variant="determinate"
									value={60}
									sx={{
										height: 8,
										borderRadius: 999,
										mb: 1,
									}}
								/>
								<Typography variant="body2" color="text.secondary">
									Sign in to see your personal impact.
								</Typography>
							</CardContent>
						</Card>
					</Box>
				</Stack>
			</Container>
		</Box>
	);
}

export default HomePage;
