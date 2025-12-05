import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layout/Layout.jsx";
import HomePage from "../../features/landing/pages/HomePage.jsx";
import MissionsPage from "../../features/missions/pages/MissionsPage.jsx";
import MissionDetailsPage from "../../features/missions/pages/MissionDetailsPage.jsx";
import ErrorPage from "../../errors/ErrorPage.jsx";
import DashboardLayout from "../../features/dashboard/layout/DashboardLayout.jsx";
import DashboardHome from "../../features/dashboard/pages/DashboardHome.jsx";
import LoginPage from "../../features/auth/pages/LoginPage.jsx";
import RegisterPage from "../../features/auth/pages/RegisterPage.jsx";
import { useUser } from "../providers/UserProvider.jsx";
import DashboardSettings from "../../features/dashboard/pages/DashboardSettings.jsx";
import DashboardMissions from "../../features/dashboard/pages/DashboardMissions.jsx";
import PublicMissionsPage from "../../features/landing/pages/PublicMissionsPage.jsx";
import DashboardMissionDetails from "../../features/dashboard/pages/DashboardMissionsDetails.jsx";







function Router() {
	const { user } = useUser();

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
						<PublicMissionsPage />
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


			{/* Dashboard (protected) */}
			<Route
				path="/dashboard"
				element={
					user ? (
						<DashboardLayout>
							<DashboardHome />
						</DashboardLayout>
					) : (
						<Navigate to="/login" replace />
					)
				}
			/>
				<Route
					path="/dashboard/settings"
					element={
						user ? (
							<DashboardLayout>
								<DashboardSettings />
							</DashboardLayout>
						) : (
							<Navigate to="/login" replace />
						)
					}
				/>
			<Route
				path="/dashboard/missions"
				element={
					user ? (
						<DashboardLayout>
							<DashboardMissions />
						</DashboardLayout>
					) : (
						<Navigate to="/login" replace />
					)
				}
			/>
			<Route
				path="/dashboard/missions/:id"
				element={
					user ? (
						<DashboardLayout>
							<DashboardMissionDetails />
						</DashboardLayout>
					) : (
						<Navigate to="/login" replace />
					)
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
