// src/features/auth/login/LoginForm.jsx
import { useState } from "react";
import { Box, Button, TextField, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PasswordField from "../../../shared/components/PasswordField.jsx";
import { useUser } from "../../../app/providers/UserProvider.jsx";

function LoginForm({ onSubmitSuccess }) {
	const [form, setForm] = useState({
		email: "",
		password: "",
	});

	const { login } = useUser();
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// TODO: replace with real API call
		const fakeUser = {
			name: "EcoTrack User",
			email: form.email,
		};

		login(fakeUser);
		if (onSubmitSuccess) onSubmitSuccess();
		navigate("/dashboard");
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			sx={{ display: "flex", flexDirection: "column", gap: 2 }}
		>
			<Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
				Log in to EcoTrack
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
				Continue your missions and see your impact.
			</Typography>

			<TextField
				fullWidth
				label="Email"
				type="email"
				name="email"
				value={form.email}
				onChange={handleChange}
			/>

			<PasswordField
				label="Password"
				name="password"
				value={form.password}
				onChange={handleChange}
			/>

			<Stack
				direction={{ xs: "column", sm: "row" }}
				justifyContent="flex-start"
				alignItems={{ xs: "stretch", sm: "center" }}
				sx={{ mt: 1, gap: 1.5 }}
			>
				<Button
					type="submit"
					variant="contained"
					sx={{
						textTransform: "none",
						bgcolor: "#166534",
						"&:hover": { bgcolor: "#14532d" },
					}}
				>
					Log in
				</Button>
			</Stack>
		</Box>
	);
}

export default LoginForm;
