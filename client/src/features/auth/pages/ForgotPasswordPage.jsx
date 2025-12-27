import { Box, Card, CardContent, Stack, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useSnackbar } from "../../../app/providers/SnackBarProvider.jsx";
import { requestPasswordReset } from "../../../services/passwordService.js";

export default function ForgotPasswordPage() {
	const { showSuccess, showError } = useSnackbar();
	const [email, setEmail] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const clean = email.trim().toLowerCase();
		if (!clean) return showError?.("Please enter your email.");

		try {
			setSubmitting(true);
			await requestPasswordReset(clean);

			// Many backends return generic success to avoid leaking if email exists
			showSuccess?.("If this email exists, we sent a reset link.");
			setEmail("");
		} catch (err) {
			console.error("[ForgotPasswordPage]", err);
			showError?.(err?.response?.data?.message || "Failed to request reset. Try again.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 520, mx: "auto", mt: 6 }}>
			<Card sx={{ borderRadius: 4 }}>
				<CardContent>
					<Stack spacing={2} component="form" onSubmit={handleSubmit}>
						<Box>
							<Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
								Forgot password
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Enter your email and we’ll send you a reset link.
							</Typography>
						</Box>

						<TextField
							label="Email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							fullWidth
						/>

						<Button
							type="submit"
							variant="contained"
							disabled={submitting}
							sx={{ textTransform: "none", bgcolor: "#166534", "&:hover": { bgcolor: "#14532d" } }}
						>
							{submitting ? "Sending..." : "Send reset link"}
						</Button>
					</Stack>
				</CardContent>
			</Card>
		</Box>
	);
}
