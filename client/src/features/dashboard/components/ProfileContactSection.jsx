// src/features/dashboard/components/ProfileContactSection.jsx
import {
	Box,
	Button,
	Stack,
	TextField,
	Typography,
} from "@mui/material";

function ProfileContactSection({
	user,
	streetDisplay,
	editMode,
	contactForm,
	onContactChange,
	onSave,
	onCancel,
	saving,
}) {
	return (
		<Box>
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
						onChange={onContactChange}
					/>
					<TextField
						label="Country"
						name="country"
						size="small"
						value={contactForm.country}
						onChange={onContactChange}
					/>
					<TextField
						label="City"
						name="city"
						size="small"
						value={contactForm.city}
						onChange={onContactChange}
					/>
					<TextField
						label="Street"
						name="street"
						size="small"
						value={contactForm.street}
						onChange={onContactChange}
					/>
					<TextField
						label="House number"
						name="houseNumber"
						size="small"
						value={contactForm.houseNumber}
						onChange={onContactChange}
					/>

					<Stack direction="row" spacing={1} sx={{ mt: 1 }}>
						<Button
							variant="contained"
							size="small"
							disabled={saving}
							onClick={onSave}
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
							onClick={onCancel}
							sx={{ textTransform: "none" }}
						>
							Cancel
						</Button>
					</Stack>
				</Stack>
			)}
		</Box>
	);
}

export default ProfileContactSection;
