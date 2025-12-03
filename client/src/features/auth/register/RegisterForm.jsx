// src/features/auth/register/RegisterForm.jsx
import { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import PasswordField from "../../../shared/components/PasswordField.jsx";

function RegisterForm({ onSubmitSuccess }) {
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// TODO: add basic validation + real register call
		if (form.password !== form.confirmPassword) {
			alert("Passwords do not match");
			return;
		}

		console.log("Register form submitted:", form);

		if (onSubmitSuccess) onSubmitSuccess();
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			sx={{ display: "flex", flexDirection: "column", gap: 2 }}
		>
			<Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
				Create your EcoTrack account
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
				Start completing missions and tracking your impact.
			</Typography>

			<TextField
				fullWidth
				label="Name"
				name="name"
				value={form.name}
				onChange={handleChange}
			/>

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

			<PasswordField
				label="Confirm password"
				name="confirmPassword"
				value={form.confirmPassword}
				onChange={handleChange}
			/>

			<Stack
				direction={{ xs: "column", sm: "row" }}
				justifyContent="space-between"
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
					Sign up
				</Button>
			</Stack>
		</Box>
	);
}

export default RegisterForm;
