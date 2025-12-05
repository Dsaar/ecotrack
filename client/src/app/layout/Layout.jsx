import { Box } from "@mui/material";
import Header from "./header/Header.jsx";
import Main from "./main/Main.jsx";
import Footer from "./footer/Footer.jsx";

function Layout({ children }) {
	return (
		<Box
			sx={{
				minHeight: "100vh",
				bgcolor: "background.default",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Header />
			<Main>{children}</Main>
			<Footer />
		</Box>
	);
}

export default Layout;
