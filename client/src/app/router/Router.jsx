import { Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout.jsx";
import HomePage from "../../features/landing/pages/HomePage.jsx";
import MissionsPage from "../../features/missions/pages/MissionsPage.jsx";
import MissionDetailsPage from "../../features/missions/pages/MissionDetailsPage.jsx";
import ErrorPage from "../../errors/ErrorPage.jsx";
import DashboardLayout from "../../features/dashboard/layout/DashboardLayout.jsx";
import DashboardHome from "../../features/dashboard/pages/DashboardHome.jsx";
import LoginPage from "../../features/auth/pages/LoginPage.jsx";
import RegisterPage from "../../features/auth/pages/RegisterPage.jsx";


function Router() {
	return (
		<Routes>
			{/* Public routes using the main Layout */}
			<Route
				path="/"
				element={
					<Layout>
						<HomePage />
					</Layout>
				}
			/>
			<Route
				path="/missions"
				element={
					<Layout>
						<MissionsPage />
					</Layout>
				}
			/>
			<Route
				path="/missions/:id"
				element={
					<Layout>
						<MissionDetailsPage />
					</Layout>
				}
			/>
			<Route
				path="/login"
				element={
					<Layout>
						<LoginPage />
					</Layout>
				}
			/>
			<Route
				path="/register"
				element={
					<Layout>
						<RegisterPage />
					</Layout>
				}
			/>


			{/* Dashboard route with its own layout */}
			<Route
				path="/dashboard"
				element={
					<DashboardLayout>
						<DashboardHome />
					</DashboardLayout>
				}
			/>

			{/* Catch-all: 404 inside the main Layout */}
			<Route
				path="*"
				element={
					<Layout>
						<ErrorPage />
					</Layout>
				}
			/>
		</Routes>
	);
}


export default Router;
