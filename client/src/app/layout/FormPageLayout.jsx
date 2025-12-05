import { Box, Card, CardContent, Container } from "@mui/material";

function FormPageLayout({ children }) {
	return (
		<Box
			sx={{
				flex: 1,
				bgcolor: "background.default",
				minHeight: "calc(100vh - 220px)", // header + footer
				display: "flex",
				alignItems: "center",
			}}
		>
			<Container maxWidth="sm">
				<Card
					elevation={0}
					sx={{
						borderRadius: 4,
						border: "1px solid",
						borderColor: "divider",
						bgcolor: "background.paper",
					}}
				>
					<CardContent sx={{ p: { xs: 3, sm: 4 } }}>{children}</CardContent>
				</Card>
			</Container>
		</Box>
	);
}

export default FormPageLayout;
