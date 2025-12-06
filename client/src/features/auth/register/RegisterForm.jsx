// src/features/auth/register/RegisterForm.jsx
import { useState } from "react";
import {
	Box,
	Button,
	Typography,
	Stack,
	Grid,
} from "@mui/material";
import PasswordField from "../../../shared/components/PasswordField.jsx";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../app/providers/UserProvider.jsx";

import RegisterNameFields from "./RegisterNameFields.jsx";
import RegisterContactFields from "./RegisterContactFields.jsx";
import RegisterAddressFields from "./RegisterAdressFields.jsx";
import RegisterAvatarFields from "./RegisterAvatarFields.jsx";

function RegisterForm() {
	const navigate = useNavigate();
	const { register } = useUser();

	const [form, setForm] = useState({
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
	});

	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		// --- Minimal validation matching Joi requirements ---
		if (!form.firstName || form.firstName.trim().length < 2) {
			setError("First name must be at least 2 characters.");
			return;
		}

		if (!form.lastName || form.lastName.trim().length < 2) {
			setError("Last name must be at least 2 characters.");
			return;
		}

		if (!form.email) {
			setError("Email is required.");
			return;
		}

		if (!form.password) {
			setError("Password is required.");
			return;
		}

		if (form.password !== form.confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		if (!form.country || form.country.trim().length < 2) {
			setError("Country is required.");
			return;
		}

		if (!form.city || form.city.trim().length < 2) {
			setError("City must be at least 2 characters.");
			return;
		}

		if (!form.street || form.street.trim().length < 2) {
			setError("Street must be at least 2 characters.");
			return;
		}

		if (!form.houseNumber) {
			setError("House number is required.");
			return;
		}

		const houseNumberNum = Number(form.houseNumber);
		if (Number.isNaN(houseNumberNum)) {
			setError("House number must be a number.");
			return;
		}

		// Build payload exactly like backend expects
		const payload = {
			name: {
				first: form.firstName.trim(),
				middle: form.middleName.trim(),
				last: form.lastName.trim(),
			},
			phone: form.phone.trim(),
			email: form.email.trim(),
			password: form.password,
			avatarUrl: {
				url: form.avatarUrl.trim(),
				alt: form.avatarAlt.trim() || "User avatar",
			},
			address: {
				state: form.state.trim(),
				country: form.country.trim(),
				city: form.city.trim(),
				street: form.street.trim(),
				houseNumber: houseNumberNum,
				zip: form.zip ? Number(form.zip) : undefined,
			},
		};

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

			{/* Passwords stay here; they’re short */}
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
