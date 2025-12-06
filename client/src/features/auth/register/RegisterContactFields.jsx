// src/features/auth/register/RegisterContactFields.jsx
import { Grid, TextField } from "@mui/material";

function RegisterContactFields({ form, onChange }) {
	return (
		<Grid container spacing={2}>
			<Grid item xs={12} sm={6}>
				<TextField
					label="Email"
					name="email"
					type="email"
					autoComplete="email"
					value={form.email}
					onChange={onChange}
					fullWidth
					required
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextField
					label="Phone"
					name="phone"
					value={form.phone}
					onChange={onChange}
					fullWidth
				/>
			</Grid>
		</Grid>
	);
}

export default RegisterContactFields;
