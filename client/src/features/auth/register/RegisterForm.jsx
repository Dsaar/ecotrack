// src/features/auth/register/RegisterForm.jsx
import { useState } from "react";
import { Box, Button, Typography, Stack, Grid } from "@mui/material";
import PasswordField from "../../../shared/components/PasswordField.jsx";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../app/providers/UserProvider.jsx";

import useForm from "../../../shared/hooks/useForm.js";
import registerSchema from "../../../shared/models/registerSchema.js";
import { useSnackbar } from "../../../app/providers/SnackBarProvider.jsx";

import RegisterNameFields from "./RegisterNameFields.jsx";
import RegisterContactFields from "./RegisterContactFields.jsx";
import RegisterAddressFields from "./RegisterAdressFields.jsx";
import RegisterAvatarFields from "./RegisterAvatarFields.jsx";

const initialValues = {
	firstName: "",
	middleName: "",
	lastName: "",
	phone: "",
	email: "",
	password: "",
	confirmPassword: "",
	avatarUrl: "",
	avatarAlt: "",
	country: "",
	state: "",
	city: "",
	street: "",
	houseNumber: "",
	zip: "",
};

function RegisterForm() {
	const navigate = useNavigate();
	const { register } = useUser();
	const { showSuccess, showError } = useSnackbar();

	const [apiError, setApiError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	// This function is called ONLY if Joi validation passes
	const handleRegisterSubmit = async (data) => {
		setApiError("");
		setSubmitting(true);

		// Build payload exactly like backend expects
		const payload = {
			name: {
				first: data.firstName.trim(),
				middle: data.middleName.trim(),
				last: data.lastName.trim(),
			},
			phone: data.phone.trim(),
			email: data.email.trim(),
			password: data.password,
			avatarUrl: {
				url: data.avatarUrl.trim(),
				alt: data.avatarAlt.trim() || "User avatar",
			},
			address: {
				state: data.state.trim(),
				country: data.country.trim(),
				city: data.city.trim(),
				street: data.street.trim(),
				houseNumber: Number(data.houseNumber),
				zip: data.zip ? Number(data.zip) : undefined,
			},
		};

		try {
			await register(payload);
			showSuccess?.("Welcome to EcoTrack! Your account was created.");
			navigate("/dashboard");
		} catch (err) {
			console.error("Register failed:", err);
			const apiMessage =
				err?.response?.data?.message ||
				err?.response?.data?.error ||
				"Registration failed. Please check your details and try again.";

			setApiError(apiMessage);
			showError?.(apiMessage);
			// rethrow if you want ErrorBoundary to see it
			// throw err;
		} finally {
			setSubmitting(false);
		}
	};

	// ✅ useForm returns `data`; we alias it to `form` so existing code still works
	const {
		data: form,
		errors,
		handleChange,
		handleSubmit,
	} = useForm(initialValues, registerSchema, handleRegisterSubmit);

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

			{apiError && (
				<Typography variant="body2" color="error">
					{apiError}
				</Typography>
			)}

			{/* You can pass errors into these components later if you want field-level error display */}
			<RegisterNameFields form={form} onChange={handleChange} />
			<RegisterContactFields form={form} onChange={handleChange} />

			{/* Password fields */}
			<Grid container spacing={2}>
				<Grid item xs={12} sm={6}>
					<PasswordField
						label="Password"
						name="password"
						value={form.password}
						onChange={handleChange}
						fullWidth
						required
						error={!!errors.password}
						helperText={
							errors.password ||
							"At least 8 chars, with upper, lower, number and symbol."
						}
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
						error={!!errors.confirmPassword}
						helperText={errors.confirmPassword}
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
