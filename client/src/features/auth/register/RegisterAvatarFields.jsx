// src/features/auth/register/RegisterAvatarFields.jsx
import { Grid, TextField, Typography } from "@mui/material";

function RegisterAvatarFields({ form, onChange }) {
	return (
		<>
			<Typography variant="subtitle2" sx={{ mt: 1 }}>
				Avatar (optional)
			</Typography>

			<Grid container spacing={2}>
				<Grid item xs={12} sm={8}>
					<TextField
						label="Avatar URL"
						name="avatarUrl"
						value={form.avatarUrl}
						onChange={onChange}
						fullWidth
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<TextField
						label="Avatar alt text"
						name="avatarAlt"
						value={form.avatarAlt}
						onChange={onChange}
						fullWidth
					/>
				</Grid>
			</Grid>
		</>
	);
}

export default RegisterAvatarFields;
