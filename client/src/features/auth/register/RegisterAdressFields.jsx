// src/features/auth/register/RegisterAdressFields.jsx
import { Stack, TextField } from "@mui/material";

function RegisterAddressFields({ form, onChange }) {
	return (
		<Stack spacing={2}>
			<TextField
				label="Country"
				name="country"
				value={form.country}
				onChange={onChange}
				fullWidth
				required
			/>

			<TextField
				label="City"
				name="city"
				value={form.city}
				onChange={onChange}
				fullWidth
				required
			/>

			<TextField
				label="State / Region"
				name="state"
				value={form.state}
				onChange={onChange}
				fullWidth
			/>

			<TextField
				label="Street"
				name="street"
				value={form.street}
				onChange={onChange}
				fullWidth
				required
			/>

			<TextField
				label="House number"
				name="houseNumber"
				value={form.houseNumber}
				onChange={onChange}
				fullWidth
				required
			/>

			<TextField
				label="ZIP code"
				name="zip"
				value={form.zip}
				onChange={onChange}
				fullWidth
			/>
		</Stack>
	);
}

export default RegisterAddressFields;
