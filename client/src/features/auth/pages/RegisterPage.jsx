import { Box } from "@mui/material";
import FormPageLayout from "../../../app/layout/FormPageLayout.jsx";
import RegisterForm from "../register/RegisterForm.jsx";

function RegisterPage() {
	return (
		<FormPageLayout>
			<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				<RegisterForm />
			</Box>
		</FormPageLayout>
	);
}

export default RegisterPage;
