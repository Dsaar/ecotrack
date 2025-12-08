// src/errors/AppErrorBoundary.jsx
import React from "react";
import { Box, Button, Typography } from "@mui/material";

class AppErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(_error) {
		return { hasError: true };
	}

	componentDidCatch(error, info) {
		console.error("[AppErrorBoundary] Caught error:", error, info);
	}

	handleReload = () => {
		window.location.href = "/";
	};

	render() {
		if (this.state.hasError) {
			return (
				<Box
					sx={{
						minHeight: "100vh",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexDirection: "column",
						gap: 2,
						bgcolor: "background.default",
						color: "text.primary",
						p: 3,
					}}
				>
					<Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
						Something went wrong
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
						An unexpected error occurred in EcoTrack. You can try reloading the page.
					</Typography>
					<Button
						variant="contained"
						onClick={this.handleReload}
						sx={{
							textTransform: "none",
							bgcolor: "#166534",
							"&:hover": { bgcolor: "#14532d" },
						}}
					>
						Reload EcoTrack
					</Button>
				</Box>
			);
		}

		return this.props.children;
	}
}

export default AppErrorBoundary;
