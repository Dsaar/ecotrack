// src/shared/components/PasswordField.jsx
import { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function PasswordField({
	label = "Password",
	value,
	onChange,
	error,
	helperText,
	name = "password",
	sx = {},
	...props
}) {
	const [showPassword, setShowPassword] = useState(false);
	const toggleShowPassword = () => setShowPassword((prev) => !prev);

	return (
		<TextField
			fullWidth
			sx={sx}
			name={name}
			label={label}
			type={showPassword ? "text" : "password"}
			value={value}
			onChange={onChange}
			error={!!error}
			helperText={helperText}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<IconButton onClick={toggleShowPassword} edge="end">
							{showPassword ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					</InputAdornment>
				),
			}}
			{...props}
		/>
	);
}

export default PasswordField;
