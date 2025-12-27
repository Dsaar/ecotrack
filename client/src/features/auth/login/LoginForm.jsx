// src/features/auth/login/LoginForm.jsx
import { useState } from "react";
import { Box, Button, TextField, Stack, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import PasswordField from "../../../shared/components/PasswordField.jsx";
import { useUser } from "../../../app/providers/UserProvider.jsx";

import useForm from "../../../shared/hooks/useForm.js";
import loginSchema from "../../../shared/models/loginSchema.js";
import { useSnackbar } from "../../../app/providers/SnackBarProvider.jsx";
import { Link as RouterLink } from "react-router-dom";


const initialValues = {
	email: "",
	password: "",
};

function LoginForm({ onSubmitSuccess }) {
	const navigate = useNavigate();
	const { login } = useUser();
	const { showSuccess, showError } = useSnackbar();

	const [apiError, setApiError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const handleLoginSubmit = async (data) => {
		setApiError("");
		setSubmitting(true);

		try {
			await login(data.email, data.password);
			showSuccess?.("Welcome back to EcoTrack!");

			if (onSubmitSuccess) onSubmitSuccess();
			navigate("/dashboard");
		} catch (err) {
			console.error("Login failed:", err);
			const msg =
				err?.response?.data?.message ||
				"Invalid email or password. Please try again.";

			setApiError(msg);
			showError?.(msg);
			// throw err; // optional if you want ErrorBoundary to catch
		} finally {
			setSubmitting(false);
		}
	};

	const {
		data: form,
		errors,
		handleChange,
		handleSubmit,
	} = useForm(initialValues, loginSchema, handleLoginSubmit);

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

			{apiError && (
				<Typography variant="body2" color="error">
					{apiError}
				</Typography>
			)}

			<TextField
				fullWidth
				label="Email"
				type="email"
				name="email"
				value={form.email}
				onChange={handleChange}
				error={!!errors.email}
				helperText={errors.email}
			/>

			<PasswordField
				label="Password"
				name="password"
				value={form.password}
				onChange={handleChange}
				error={!!errors.password}
				helperText={errors.password}
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
					disabled={submitting}
					sx={{
						textTransform: "none",
						bgcolor: "#166534",
						"&:hover": { bgcolor: "#14532d" },
					}}
				>
					{submitting ? "Logging in..." : "Log in"}
				</Button>
				<Link
					component={RouterLink}
					to="/forgot-password"
					variant="body2"
					sx={{ alignSelf: "flex-end" }}
				>
					Forgot password?
				</Link>
			</Stack>
		</Box>
	);
}

export default LoginForm;
