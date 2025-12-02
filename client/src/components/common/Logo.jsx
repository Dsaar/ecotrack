// src/components/common/Logo.jsx
import { Box } from "@mui/material";
import logo from "../../assets/ecotrack-logo.svg";

function Logo({ height = 32, ...props }) {
	return (
		<Box
			component="img"
			src={logo}
			alt="EcoTrack logo"
			sx={{ height, width: "auto", display: "block" }}
			{...props}
		/>
	);
}

export default Logo;
