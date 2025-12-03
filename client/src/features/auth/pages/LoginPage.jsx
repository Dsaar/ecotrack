// src/features/auth/pages/LoginPage.jsx
import { Box, Card, CardContent, Typography } from "@mui/material";
import LoginForm from "../login/LoginForm.jsx";

function LoginPage() {
	return (
		<Box
			sx={{
				minHeight: "60vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				py: 4,
			}}
		>
			<Card
				elevation={0}
				sx={{
					width: "100%",
					maxWidth: 420,
					borderRadius: 3,
					border: "1px solid #e5e7eb",
					bgcolor: "white",
				}}
			>
				<CardContent sx={{ p: 4 }}>
					<LoginForm />
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mt: 2, textAlign: "center" }}
					>
						Don&apos;t have an account? Sign up from the header.
					</Typography>
				</CardContent>
			</Card>
		</Box>
	);
}

export default LoginPage;
