// src/features/auth/register/RegisterAvatarFields.jsx
import { Stack, TextField, Typography } from "@mui/material";

function RegisterAvatarFields({ form, onChange }) {
	return (
		<Stack spacing={2}>
			<Typography variant="subtitle2" color="text.secondary">
				Avatar (optional)
			</Typography>

			<TextField
				label="Avatar URL"
				name="avatarUrl"
				value={form.avatarUrl}
				onChange={onChange}
				fullWidth
			/>

			<TextField
				label="Avatar alt text"
				name="avatarAlt"
				value={form.avatarAlt}
				onChange={onChange}
				fullWidth
			/>
		</Stack>
	);
}

export default RegisterAvatarFields;
