// src/features/auth/register/RegisterNameFields.jsx
import { Grid, TextField } from "@mui/material";

function RegisterNameFields({ form, onChange }) {
	return (
		<Grid container spacing={2}>
			<Grid item xs={12} sm={4}>
				<TextField
					label="First name"
					name="firstName"
					value={form.firstName}
					onChange={onChange}
					fullWidth
					required
				/>
			</Grid>
			<Grid item xs={12} sm={4}>
				<TextField
					label="Middle name"
					name="middleName"
					value={form.middleName}
					onChange={onChange}
					fullWidth
				/>
			</Grid>
			<Grid item xs={12} sm={4}>
				<TextField
					label="Last name"
					name="lastName"
					value={form.lastName}
					onChange={onChange}
					fullWidth
					required
				/>
			</Grid>
		</Grid>
	);
}

export default RegisterNameFields;
