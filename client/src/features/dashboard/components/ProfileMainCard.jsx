// src/features/dashboard/components/ProfileMainCard.jsx
import { Card, CardContent, Divider } from "@mui/material";
import { useState } from "react";
import { useUser } from "../../../app/providers/UserProvider.jsx";
import { useSnackbar } from "../../../app/providers/SnackBarProvider.jsx";
import { updateMe } from "../../../services/userService.js";
import ProfileHeader from "./ProfileHeader.jsx";
import ProfileContactSection from "./ProfileContactSection.jsx";

function getFullName(name) {
	if (!name) return "";
	return [name.first, name.middle, name.last].filter(Boolean).join(" ");
}

function makeContactStateFromUser(user) {
	return {
		phone: user?.phone || "",
		country: user?.address?.country || "",
		city: user?.address?.city || "",
		street: user?.address?.street || "",
		houseNumber: user?.address?.houseNumber
			? String(user.address.houseNumber)
			: "",
	};
}

function ProfileMainCard() {
	const { user, refreshUser } = useUser();
	const { showSuccess, showError } = useSnackbar();

	const fullName = getFullName(user?.name) || "EcoTrack member";
	const email = user?.email || "No email";

	const [editMode, setEditMode] = useState(false);
	const [contactForm, setContactForm] = useState(
		makeContactStateFromUser(user)
	);
	const [saving, setSaving] = useState(false);

	const syncFormWithUser = () => {
		setContactForm(makeContactStateFromUser(user));
	};

	const handleToggleEdit = () => {
		if (editMode) {
			// leaving edit mode → reset form
			syncFormWithUser();
			setEditMode(false);
		} else {
			// entering edit mode
			syncFormWithUser();
			setEditMode(true);
		}
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
				<ProfileHeader
					fullName={fullName}
					email={email}
					avatarUrl={avatarUrl}
					avatarAlt={avatarAlt}
					initialLetter={initialLetter}
					editMode={editMode}
					onToggleEdit={handleToggleEdit}
				/>

				<Divider sx={{ my: 2 }} />

				<ProfileContactSection
					user={user}
					streetDisplay={streetDisplay}
					editMode={editMode}
					contactForm={contactForm}
					onContactChange={handleContactChange}
					onSave={handleSave}
					onCancel={handleCancel}
					saving={saving}
				/>
			</CardContent>
		</Card>
	);
}

export default ProfileMainCard;
