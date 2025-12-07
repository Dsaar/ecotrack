// src/features/auth/register/RegisterForm.jsx
import { useState } from "react";
import { Box, Button, Typography, Stack, Grid } from "@mui/material";
import PasswordField from "../../../shared/components/PasswordField.jsx";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../app/providers/UserProvider.jsx";

import RegisterNameFields from "./RegisterNameFields.jsx";
import RegisterContactFields from "./RegisterContactFields.jsx";
import RegisterAddressFields from "./RegisterAdressFields.jsx";
import RegisterAvatarFields from "./RegisterAvatarFields.jsx";

import initialRegisterForm from "../helpers/initialRegisterForm.js";
import mapRegisterFormToPayload from "../helpers/mapRegisterFormToPayload.js";
import validateRegisterForm from "../helpers/validateRegisterForm.js";

function RegisterForm() {
	const navigate = useNavigate();
	const { register } = useUser();

	const [form, setForm] = useState(initialRegisterForm);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		// ✅ Validate via helper
		const validationError = validateRegisterForm(form);
		if (validationError) {
			setError(validationError);
			return;
		}

		// ✅ Build payload via helper
		const payload = mapRegisterFormToPayload(form);

		try {
			setSubmitting(true);
			await register(payload);
			navigate("/dashboard");
		} catch (err) {
			console.error("Register failed:", err);
			console.log("REGISTER ERROR RESPONSE:", err.response?.data);

			const apiMessage =
				err?.response?.data?.message ||
				err?.response?.data?.error ||
				"Registration failed. Please check your details and try again.";

			setError(apiMessage);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			sx={{ display: "flex", flexDirection: "column", gap: 3 }}
		>
			<Box>
				<Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
					Create your EcoTrack account
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Join EcoTrack to start completing missions and tracking your impact.
				</Typography>
			</Box>

			{error && (
				<Typography variant="body2" color="error">
					{error}
				</Typography>
			)}

			<RegisterNameFields form={form} onChange={handleChange} />
			<RegisterContactFields form={form} onChange={handleChange} />

			{/* Passwords */}
			<Grid container spacing={2}>
				<Grid item xs={12} sm={6}>
					<PasswordField
						label="Password"
						name="password"
						value={form.password}
						onChange={handleChange}
						fullWidth
						required
						helperText="At least 8 chars, with upper, lower, number and symbol."
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<PasswordField
						label="Confirm password"
						name="confirmPassword"
						value={form.confirmPassword}
						onChange={handleChange}
						fullWidth
						required
					/>
				</Grid>
			</Grid>

			<RegisterAddressFields form={form} onChange={handleChange} />
			<RegisterAvatarFields form={form} onChange={handleChange} />

			<Stack
				direction={{ xs: "column", sm: "row" }}
				spacing={2}
				sx={{ mt: 2 }}
				alignItems={{ xs: "stretch", sm: "center" }}
			>
				<Button
					type="submit"
					variant="contained"
					disabled={submitting}
					sx={{
						textTransform: "none",
						bgcolor: "#166534",
						"&:hover": { bgcolor: "#14532d" },
					}}
				>
					{submitting ? "Creating account..." : "Sign up"}
				</Button>
			</Stack>
		</Box>
	);
}

export default RegisterForm;
