// src/features/auth/register/RegisterAddressFields.jsx
import { Grid, TextField, Typography } from "@mui/material";

function RegisterAddressFields({ form, onChange }) {
	return (
		<>
			<Typography variant="subtitle2" sx={{ mt: 1 }}>
				Address
			</Typography>

			<Grid container spacing={2}>
				<Grid item xs={12} sm={4}>
					<TextField
						label="Country"
						name="country"
						value={form.country}
						onChange={onChange}
						fullWidth
						required
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<TextField
						label="City"
						name="city"
						value={form.city}
						onChange={onChange}
						fullWidth
						required
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<TextField
						label="State / Region"
						name="state"
						value={form.state}
						onChange={onChange}
						fullWidth
					/>
				</Grid>

				<Grid item xs={12} sm={6}>
					<TextField
						label="Street"
						name="street"
						value={form.street}
						onChange={onChange}
						fullWidth
						required
					/>
				</Grid>
				<Grid item xs={6} sm={3}>
					<TextField
						label="House number"
						name="houseNumber"
						value={form.houseNumber}
						onChange={onChange}
						fullWidth
						required
					/>
				</Grid>
				<Grid item xs={6} sm={3}>
					<TextField
						label="ZIP code"
						name="zip"
						value={form.zip}
						onChange={onChange}
						fullWidth
					/>
				</Grid>
			</Grid>
		</>
	);
}

export default RegisterAddressFields;
