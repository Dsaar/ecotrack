// src/features/auth/pages/RegisterPage.jsx
import { Box, Card, CardContent, Typography } from "@mui/material";
import RegisterForm from "../register/RegisterForm.jsx";

function RegisterPage() {
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
					maxWidth: 460,
					borderRadius: 3,
					border: "1px solid #e5e7eb",
					bgcolor: "white",
				}}
			>
				<CardContent sx={{ p: 4 }}>
					<RegisterForm />
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mt: 2, textAlign: "center" }}
					>
						Already have an account? Log in from the header.
					</Typography>
				</CardContent>
			</Card>
		</Box>
	);
}

export default RegisterPage;
