// src/features/dashboard/components/ProfileMainCard.jsx
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useUser } from "../../../app/providers/UserProvider.jsx";
import { useSnackbar } from "../../../app/providers/SnackBarProvider.jsx";
import { updateMe } from "../../../services/userService.js";

function getFullName(name) {
	if (!name) return "";
	return [name.first, name.middle, name.last].filter(Boolean).join(" ");
}

function ProfileMainCard() {
	const { user, refreshUser } = useUser();
	const { showSuccess, showError } = useSnackbar();

	const fullName = getFullName(user?.name) || "EcoTrack member";
	const email = user?.email || "No email";

	const makeContactStateFromUser = (u) => ({
		phone: u?.phone || "",
		country: u?.address?.country || "",
		city: u?.address?.city || "",
		street: u?.address?.street || "",
		houseNumber: u?.address?.houseNumber ? String(u.address.houseNumber) : "",
	});

	const [editMode, setEditMode] = useState(false);
	const [contactForm, setContactForm] = useState(makeContactStateFromUser(user));
	const [saving, setSaving] = useState(false);

	const syncFormWithUser = () => {
		setContactForm(makeContactStateFromUser(user));
	};

	const handleEditClick = () => {
		syncFormWithUser();
		setEditMode(true);
	};

	const handleCancel = () => {
		syncFormWithUser();
		setEditMode(false);
	};

	const handleContactChange = (e) => {
		const { name, value } = e.target;
		setContactForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = async () => {
		try {
			setSaving(true);

			const payload = {
				phone: contactForm.phone.trim(),
				address: {
					country: contactForm.country.trim(),
					city: contactForm.city.trim(),
					street: contactForm.street.trim(),
					houseNumber: contactForm.houseNumber
						? Number(contactForm.houseNumber)
						: undefined,
				},
			};

			// Drop empty/NaN address fields
			Object.keys(payload.address).forEach((key) => {
				const val = payload.address[key];
				if (val === "" || val === undefined || Number.isNaN(val)) {
					delete payload.address[key];
				}
			});

			await updateMe(payload);
			await refreshUser();

			showSuccess?.("Profile updated successfully.");
			setEditMode(false);
		} catch (err) {
			console.error("Failed to update profile:", err);
			const msg =
				err?.response?.data?.message ||
				err?.response?.data?.error ||
				"Failed to update profile.";
			showError?.(msg);
		} finally {
			setSaving(false);
		}
	};

	// Avatar logic
	const avatarUrl = user?.avatarUrl?.url || null;
	const avatarAlt = user?.avatarUrl?.alt || fullName;
	const initialLetter = (fullName[0] || "U").toUpperCase();

	const streetDisplay =
		user?.address?.street
			? `${user.address.street}${user.address.houseNumber ? " " + user.address.houseNumber : ""
			}`
			: "Not provided";

	return (
		<Card sx={{ mb: 3, borderRadius: 4 }}>
			<CardContent>
				<Stack
					direction={{ xs: "column", sm: "row" }}
					spacing={3}
					alignItems={{ xs: "flex-start", sm: "center" }}
				>
					{/* Avatar */}
					<Avatar
						src={avatarUrl || undefined}
						alt={avatarAlt}
						sx={{
							width: 64,
							height: 64,
							bgcolor: avatarUrl ? "transparent" : "#166534",
							fontSize: 28,
							fontWeight: 600,
						}}
					>
						{!avatarUrl && initialLetter}
					</Avatar>

					<Box sx={{ flexGrow: 1 }}>
						<Stack
							direction="row"
							justifyContent="space-between"
							alignItems="flex-start"
							sx={{ mb: 1 }}
						>
							<Box>
								<Typography variant="h6" sx={{ fontWeight: 600 }}>
									{fullName}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{email}
								</Typography>
								<Box sx={{ mt: 1 }}>
									<Typography
										variant="caption"
										sx={{
											px: 1.5,
											py: 0.5,
											borderRadius: 999,
											border: "1px solid #e5e7eb",
										}}
									>
										Member
									</Typography>
								</Box>
							</Box>

							<Button
								variant="outlined"
								size="small"
								onClick={editMode ? handleCancel : handleEditClick}
								sx={{ textTransform: "none" }}
							>
								{editMode ? "Cancel" : "Edit profile"}
							</Button>
						</Stack>

						<Divider sx={{ my: 2 }} />

						<Typography variant="subtitle2" sx={{ mb: 1 }}>
							Contact
						</Typography>

						{!editMode ? (
							<>
								<Typography variant="body2" color="text.secondary">
									<strong>Phone:</strong> {user?.phone || "Not provided"}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									<strong>Country:</strong>{" "}
									{user?.address?.country || "Not provided"}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									<strong>City:</strong> {user?.address?.city || "Not provided"}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									<strong>Street:</strong> {streetDisplay}
								</Typography>
							</>
						) : (
							<Stack spacing={1.5} sx={{ maxWidth: 400 }}>
								<TextField
									label="Phone"
									name="phone"
									size="small"
									value={contactForm.phone}
									onChange={handleContactChange}
								/>
								<TextField
									label="Country"
									name="country"
									size="small"
									value={contactForm.country}
									onChange={handleContactChange}
								/>
								<TextField
									label="City"
									name="city"
									size="small"
									value={contactForm.city}
									onChange={handleContactChange}
								/>
								<TextField
									label="Street"
									name="street"
									size="small"
									value={contactForm.street}
									onChange={handleContactChange}
								/>
								<TextField
									label="House number"
									name="houseNumber"
									size="small"
									value={contactForm.houseNumber}
									onChange={handleContactChange}
								/>

								<Stack direction="row" spacing={1} sx={{ mt: 1 }}>
									<Button
										variant="contained"
										size="small"
										disabled={saving}
										onClick={handleSave}
										sx={{
											textTransform: "none",
											bgcolor: "#166534",
											"&:hover": { bgcolor: "#14532d" },
										}}
									>
										{saving ? "Saving..." : "Save changes"}
									</Button>
									<Button
										variant="text"
										size="small"
										disabled={saving}
										onClick={handleCancel}
										sx={{ textTransform: "none" }}
									>
										Cancel
									</Button>
								</Stack>
							</Stack>
						)}
					</Box>
				</Stack>
			</CardContent>
		</Card>
	);
}

export default ProfileMainCard;
