import {
	Box,
	Button,
	Container,
	Stack,
	Typography,
	Card,
	CardContent,
	Divider,
	Grid,
	Chip,
	Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// ✅ MUI Icons
import PublicIcon from "@mui/icons-material/Public";
import FlagIcon from "@mui/icons-material/Flag";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VerifiedIcon from "@mui/icons-material/Verified";
import StarsIcon from "@mui/icons-material/Stars";
import InsightsIcon from "@mui/icons-material/Insights";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";


function FeatureCard({ icon, title, description, chips = [], tone = "green" }) {
	const toneStyles =
		tone === "blue"
			? { bg: "rgba(59,130,246,0.12)", fg: "#1d4ed8" }
			: tone === "amber"
			? { bg: "rgba(245,158,11,0.14)", fg: "#b45309" }
			: { bg: "rgba(22,101,52,0.10)", fg: "#166534" };

	return (
		<Card
			sx={{
				height: "100%",
				borderRadius: 2,
				border: "1px solid",
				borderColor: "divider",
				boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
				transition: "transform .15s ease, box-shadow .15s ease",
				"&:hover": {
					transform: "translateY(-3px)",
					boxShadow: "0 18px 38px rgba(0,0,0,0.10)",
				},
			}}
		>
			<CardContent sx={{ p: { xs: 2.25, md: 2.75 } }}>
				<Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.25 }}>
					<Box
						sx={{
							width: 44,
							height: 44,
							borderRadius: 2,
							display: "grid",
							placeItems: "center",
							bgcolor: toneStyles.bg,
							color: toneStyles.fg,
						}}
					>
						{icon}
					</Box>
					<Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
						{title}
					</Typography>
				</Stack>

				<Typography variant="body2" color="text.secondary" sx={{ mb: chips.length ? 1.5 : 0 }}>
					{description}
				</Typography>

				{chips.length > 0 && (
					<Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
						{chips.map((c) => (
							<Chip
								key={c}
								size="small"
								label={c}
								variant="outlined"
								sx={{ borderRadius: 999, fontSize: 12 }}
							/>
						))}
					</Stack>
				)}
			</CardContent>
		</Card>
	);
}

export default function AboutPage() {
	const navigate = useNavigate();

	return (
		<Box
			sx={{
				minHeight: "calc(100vh - 140px)",
				py: { xs: 5, md: 8 },
				bgcolor: "background.default",
			}}
		>
			<Container maxWidth="lg">
				<Stack spacing={{ xs: 4, md: 5 }}>
					{/* ✅ HERO (more color + visually “wow”) */}
					<Box sx={{ position: "relative" }}>
						<Box
							sx={{
								position: "absolute",
								inset: -20,
								pointerEvents: "none",
								opacity: 0.9,
								background:
									"radial-gradient(900px 380px at 10% -20%, rgba(34,197,94,0.20), transparent 60%)," +
									"radial-gradient(700px 320px at 90% 0%, rgba(59,130,246,0.16), transparent 55%)," +
									"radial-gradient(800px 360px at 50% 120%, rgba(16,185,129,0.18), transparent 60%)",
								filter: "blur(0px)",
							}}
						/>

						<Paper
							elevation={0}
							sx={{
								position: "relative",
								borderRadius: 2,
								p: { xs: 2.5, md: 4 },
								border: "1px solid",
								borderColor: "divider",
								bgcolor: "background.paper",
								boxShadow: "0 18px 50px rgba(0,0,0,0.06)",
								overflow: "hidden",
							}}
						>
							<Stack spacing={2}>


								<Typography
									variant="h2"
									sx={{
										fontWeight: 950,
										letterSpacing: -0.6,
										fontSize: { xs: 34, sm: 48, md: 60 },
										lineHeight: 1.05,
									}}
								>
									About EcoTrack
								</Typography>

								<Typography
									variant="h6"
									color="text.secondary"
									sx={{ mt: 0.5, fontSize: { xs: 15, sm: 18 }, maxWidth: 860 }}
								>
									EcoTrack helps you turn small eco-friendly actions into measurable progress—one mission
									at a time. Discover missions, complete them, earn points, and see your impact add up.
									You can even chat with other users and stay motivated together.
								</Typography>

								<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 2 }}>
									<Button
										variant="contained"
										onClick={() => navigate("/register")}
										sx={{
											textTransform: "none",
											bgcolor: "#166534",
											"&:hover": { bgcolor: "#14532d" },
											px: 3,
											py: 1.1,
											borderRadius: 2,
										}}
									>
										Sign up & start tracking
									</Button>

									<Button
										variant="outlined"
										color="inherit"
										onClick={() => navigate("/missions")}
										sx={{ textTransform: "none", px: 3, py: 1.1, borderRadius: 2.5 }}
									>
										Browse missions
									</Button>
								</Stack>
							</Stack>
						</Paper>
					</Box>

					{/* ✅ Mission */}
					<Card sx={{ borderRadius: 2 }}>
						<CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
							<Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.25 }}>
								<Box
									sx={{
										width: 44,
										height: 44,
										borderRadius: 2,
										display: "grid",
										placeItems: "center",
										bgcolor: "rgba(22,101,52,0.10)",
										color: "#166534",
									}}
								>
									<FlagIcon />
								</Box>
								<Typography variant="h5" sx={{ fontWeight: 900 }}>
									Our mission
								</Typography>
							</Stack>

							<Typography variant="body1" color="text.secondary" sx={{ maxWidth: 980 }}>
								Make sustainability practical, rewarding, and social. EcoTrack is designed to help you build
								habits that matter—while keeping things simple: choose a mission, submit proof if needed,
								get approved, and record your progress as a verified check-in with points and impact.
							</Typography>
						</CardContent>
						<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 2 }} m={3}>
							<Chip
								icon={< PublicIcon />}
								label="EcoTrack"
								sx={{
									bgcolor: "#ecfdf3",
									color: "#166534",
									fontWeight: 900,
									borderRadius: 999,
								}}
							/>
							<Chip
								icon={<VerifiedIcon />}
								label="Verified progress"
								variant="outlined"
								sx={{ borderRadius: 999 }}
							/>
							<Chip
								icon={<InsightsIcon />}
								label="Track your impact"
								variant="outlined"
								sx={{ borderRadius: 999}}
							/>
						</Stack>
					</Card>

					{/* ✅ Feature cards with icons */}
					<Box>
						<Typography variant="h5" sx={{ fontWeight: 950, mb: 0.5 }}>
							What EcoTrack includes
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, maxWidth: 900 }}>
							A clean, modern dashboard experience that helps you discover missions, stay accountable, and
							track real progress over time.
						</Typography>

						<Grid container spacing={2.5}>
							<Grid item xs={12} sm={6} md={4}>
								<FeatureCard
									icon={<PublicIcon />}
									title="Mission library"
									description="Explore missions by category, difficulty, and tags—built to match real life."
									chips={["Categories", "Difficulty", "Tags"]}
								/>
							</Grid>

							<Grid item xs={12} sm={6} md={4}>
								<FeatureCard
									icon={<SearchIcon />}
									title="Smart search"
									description="Search within pages or use global search to jump straight to the right screen."
									chips={["In-page filter", "Global navigation"]}
									tone="blue"
								/>
							</Grid>

							<Grid item xs={12} sm={6} md={4}>
								<FeatureCard
									icon={<FavoriteIcon />}
									title="Saved missions"
									description="Bookmark missions you want to do later and keep a personal queue."
									chips={["Favorites", "Quick access"]}
									tone="amber"
								/>
							</Grid>

							<Grid item xs={12} sm={6} md={4}>
								<FeatureCard
									icon={<VerifiedIcon />}
									title="Submissions & approvals"
									description="Submit proof when required. Approval turns effort into verified progress."
									chips={["Pending", "Approved", "Rejected"]}
								/>
							</Grid>

							<Grid item xs={12} sm={6} md={4}>
								<FeatureCard
									icon={<StarsIcon />}
									title="Check-ins & impact"
									description="Approved completions become check-ins: points earned + CO₂/water/waste tracked."
									chips={["History", "Totals", "Impact"]}
								/>
							</Grid>

							<Grid item xs={12} sm={6} md={4}>
								<FeatureCard
									icon={<LeaderboardIcon />}
									title="Community leaderboard"
									description="See your rank and climb the leaderboard through consistent progress."
									chips={["Rank", "Points", "Community"]}
									tone="blue"
								/>
							</Grid>

							<Grid item xs={12} sm={6} md={4}>
								<FeatureCard
									icon={<ChatBubbleOutlineIcon />}
									title="Chat with other users"
									description="Connect, coordinate missions, share tips, and stay accountable together."
									chips={["Online status", "Unread badge", "Realtime"]}
								/>
							</Grid>

							<Grid item xs={12} sm={6} md={4}>
								<FeatureCard
									icon={<AdminPanelSettingsIcon />}
									title="Admin moderation"
									description="Admins can approve/reject submissions (with reasons) and manage users."
									chips={["Moderation", "User management"]}
									tone="amber"
								/>
							</Grid>
						</Grid>
					</Box>

					<Divider />

					{/* ✅ CTA footer (color band) */}
					<Paper
						elevation={0}
						sx={{
							borderRadius: 2,
							p: { xs: 2.5, md: 3.5 },
							border: "1px solid",
							borderColor: "divider",
							background:
								"linear-gradient(135deg, rgba(22,101,52,0.12), rgba(59,130,246,0.08))",
						}}
					>
						<Stack
							direction={{ xs: "column", md: "row" }}
							spacing={2}
							alignItems={{ xs: "flex-start", md: "center" }}
							justifyContent="space-between"
						>
							<Box>
								<Typography variant="h5" sx={{ fontWeight: 950 }}>
									Ready to make an impact?
								</Typography>
								<Typography variant="body1" color="text.secondary" sx={{ mt: 0.75 }}>
									Join EcoTrack and start building your eco-habits—one mission at a time.
								</Typography>
							</Box>

							<Button
								variant="contained"
								onClick={() => navigate("/register")}
								sx={{
									textTransform: "none",
									bgcolor: "#166534",
									"&:hover": { bgcolor: "#14532d" },
									px: 4,
									py: 1.2,
									borderRadius: 2.5,
									alignSelf: { xs: "stretch", sm: "flex-start", md: "auto" },
								}}
							>
								Sign up
							</Button>
						</Stack>
					</Paper>
				</Stack>
			</Container>
		</Box>
	);
}
