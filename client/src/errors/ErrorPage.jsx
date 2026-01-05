
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ErrorPage() {
	const navigate = useNavigate();


	return (
		<Box
			sx={{
				minHeight: "calc(100vh - 120px)",
				display: "grid",
				placeItems: "center",
				px: { xs: 2, sm: 3 },
				py: { xs: 6, sm: 8 },
				mb:-20
			}}
		>
			<Box
				sx={{
					width: "100%",
					maxWidth: 920,
					borderRadius: 2,
					p: { xs: 3, sm: 4.5 },
					border: "1px solid",
					borderColor: "divider",
					bgcolor: "background.paper",
					boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
					position: "relative",
					overflow: "hidden",
					mb:10
				}}
			>
				{/* subtle EcoTrack glow */}
				<Box
					aria-hidden
					sx={{
						position: "absolute",
						inset: -200,
						background:
							"radial-gradient(circle at 20% 30%, rgba(22,101,52,0.25), transparent 45%), radial-gradient(circle at 80% 40%, rgba(0,180,216,0.18), transparent 50%)",
						filter: "blur(2px)",
						pointerEvents: "none",
					}}
				/>

				<Stack
					direction={{ xs: "column", md: "row" }}
					spacing={{ xs: 3, md: 4 }}
					alignItems={{ xs: "flex-start", md: "center" }}
					sx={{ position: "relative" }}
				>
					{/* Left */}
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Typography
							sx={{
								letterSpacing: 2,
								fontWeight: 800,
								color: "text.secondary",
								mb: 4,
							}}
						>
							ECO TRACK • 404
						</Typography>

						<Typography
							variant="h2"
							sx={{
								fontWeight: 900,
								lineHeight: 1.05,
								fontSize: { xs: 44, sm: 56, md: 64 },
								mb: 1,
							}}
						>
							Page not found
						</Typography>

						<Typography
							variant="body1"
							color="text.secondary"
							sx={{ maxWidth: 540, mb: 3 }}
						>
							The page you’re looking for doesn’t exist (or it was moved).
							Let’s get you back to something useful.
						</Typography>

						<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
							<Button
								variant="contained"
								onClick={() => navigate("/")}
								sx={{
									textTransform: "none",
									bgcolor: "#166534",
									"&:hover": { bgcolor: "#14532d" },
									borderRadius: 3,
									px: 3,
								}}
							>
								Go to Home
							</Button>

							<Button
								variant="outlined"
								color="inherit"
								onClick={() => navigate("/missions")}
								sx={{
									textTransform: "none",
									borderRadius: 3,
									px: 3,
								}}
							>
								Browse missions
							</Button>

							<Button
								variant="text"
								onClick={() => navigate(-1)}
								sx={{ textTransform: "none" }}
							>
								Go back
							</Button>
						</Stack>
					</Box>
				</Stack>
			</Box>
		</Box>
	);
}


export default ErrorPage;



