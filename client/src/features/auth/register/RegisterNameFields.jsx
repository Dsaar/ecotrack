// src/features/auth/register/RegisterNameFields.jsx
import { Stack, TextField } from "@mui/material";

function RegisterNameFields({ form, onChange }) {
	return (
		<Stack spacing={2}>
			<TextField
				label="First name"
				name="firstName"
				value={form.firstName}
				onChange={onChange}
				fullWidth
				required
			/>

			<TextField
				label="Middle name"
				name="middleName"
				value={form.middleName}
				onChange={onChange}
				fullWidth
			/>

			<TextField
				label="Last name"
				name="lastName"
				value={form.lastName}
				onChange={onChange}
				fullWidth
				required
			/>
		</Stack>
	);
}

export default RegisterNameFields;
