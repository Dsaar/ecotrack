// src/features/auth/register/RegisterContactFields.jsx
import { Stack, TextField } from "@mui/material";

function RegisterContactFields({ form, onChange }) {
	return (
		<Stack spacing={2}>
			<TextField
				label="Email"
				name="email"
				type="email"
				value={form.email}
				onChange={onChange}
				fullWidth
				required
			/>

			<TextField
				label="Phone"
				name="phone"
				value={form.phone}
				onChange={onChange}
				fullWidth
			/>
		</Stack>
	);
}

export default RegisterContactFields;
