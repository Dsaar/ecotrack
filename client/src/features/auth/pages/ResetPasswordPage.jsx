import { Box, Card, CardContent, Stack, Typography, Button } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PasswordField from "../../../shared/components/PasswordField.jsx";
import { useSnackbar } from "../../../app/providers/SnackBarProvider.jsx";
import { resetPassword } from "../../../services/passwordService.js";

export default function ResetPasswordPage() {
	const navigate = useNavigate();
	const { showSuccess, showError } = useSnackbar();

	const [params] = useSearchParams();
	const token = useMemo(() => params.get("token") || "", [params]);
	const email = useMemo(() => params.get("email") || "", [params]); // ✅ ADD

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const canSubmit = token && email && password && confirmPassword; // ✅ UPDATE

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!token) return showError?.("Reset token is missing.");
		if (!email) return showError?.("Email is missing from the reset link."); // ✅ ADD
		if (!password) return showError?.("Please enter a new password.");
		if (password !== confirmPassword) return showError?.("Passwords do not match.");

		try {
			setSubmitting(true);
			await resetPassword({ email, token, password }); // ✅ FIX PAYLOAD

			showSuccess?.("Password updated. You can now log in.");
			navigate("/login", { replace: true });
		} catch (err) {
			console.error("[ResetPasswordPage]", err);
			showError?.(err?.response?.data?.message || "Reset failed. The link may be expired.");
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
								Reset password
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Set a new password for your EcoTrack account.
							</Typography>
						</Box>

						{(!token || !email) ? (
							<Typography color="error">
								This reset link is invalid (missing {(!token && !email) ? "token and email" : !token ? "token" : "email"}).
							</Typography>
						) : null}

						<PasswordField
							label="New password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							fullWidth
							required
						/>

						<PasswordField
							label="Confirm new password"
							name="confirmPassword"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							fullWidth
							required
						/>

						<Button
							type="submit"
							variant="contained"
							disabled={submitting || !canSubmit}
							sx={{ textTransform: "none", bgcolor: "#166534", "&:hover": { bgcolor: "#14532d" } }}
						>
							{submitting ? "Updating..." : "Update password"}
						</Button>
					</Stack>
				</CardContent>
			</Card>
		</Box>
	);
}
