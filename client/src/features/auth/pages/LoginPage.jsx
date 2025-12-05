// src/features/auth/pages/LoginPage.jsx
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FormPageLayout from "../../../app/layout/FormPageLayout.jsx";
import LoginForm from "../login/LoginForm.jsx";
import { useUser } from "../../../app/providers/UserProvider.jsx";

function LoginPage() {
	const { login } = useUser();
	const navigate = useNavigate();

	const handleLogin = async (values) => {
		// values is expected to be { email, password }
		try {
			await login(values.email, values.password);
			navigate("/dashboard");
		} catch (err) {
			console.error("Login failed:", err);
			// later we can add error state + show helper text in the form
		}
	};

	return (
		<FormPageLayout>
			<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				<LoginForm onSubmit={handleLogin} />
			</Box>
		</FormPageLayout>
	);
}

export default LoginPage;
