// src/app/router/Router.jsx
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
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import DashboardProfile from "../../features/dashboard/pages/DashboardProfile.jsx";
import DashboardActivity from "../../features/dashboard/pages/DashboardActivity.jsx";
import DashboardCommunity from "../../features/dashboard/pages/DashboardCommunity.jsx";




// ✅ Small helper to protect dashboard routes
function ProtectedRoute({ children }) {
	const { user, initializing } = useUser();

	// While we’re checking the token (calling /auth/me), don’t redirect yet
	if (initializing) {
		return <LoadingSpinner fullScreen />;
	}

	// No user after initialization → go to login
	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return children;
}

function Router() {
	// You *can* still read user here if you like, but protection is centralized
	// const { user } = useUser();

	const renderDashboardPage = (PageComponent) => (
		<ProtectedRoute>
			<DashboardLayout>
				<PageComponent />
			</DashboardLayout>
		</ProtectedRoute>
	);

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

			{/* Dashboard (all protected via ProtectedRoute) */}
			<Route
				path="/dashboard"
				element={renderDashboardPage(DashboardHome)}
			/>

			<Route
				path="/dashboard/settings"
				element={renderDashboardPage(DashboardSettings)}
			/>

			<Route
				path="/dashboard/missions"
				element={renderDashboardPage(DashboardMissions)}
			/>

			<Route
				path="/dashboard/missions/:id"
				element={renderDashboardPage(DashboardMissionDetails)}
			/>
			<Route
				path="/dashboard/profile"
				element={renderDashboardPage(DashboardProfile)}
			/>
			<Route
				path="/dashboard/activity"
				element={renderDashboardPage(DashboardActivity)}
			/>
			<Route
				path="/dashboard/community"
				element={renderDashboardPage(DashboardCommunity)}
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
