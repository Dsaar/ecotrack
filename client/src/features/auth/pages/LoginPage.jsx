import { Box } from "@mui/material";
import FormPageLayout from "../../../app/layout/FormPageLayout.jsx";
import LoginForm from "../login/LoginForm.jsx";

function LoginPage() {
	return (
		<FormPageLayout>
			<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				<LoginForm />
			</Box>
		</FormPageLayout>
	);
}

export default LoginPage;
