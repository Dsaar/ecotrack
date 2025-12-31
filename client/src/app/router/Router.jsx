// src/app/router/Router.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layout/Layout.jsx";
import HomePage from "../../features/landing/pages/HomePage.jsx";
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
import DashboardFavoritesPage from "../../features/dashboard/pages/DashboardFavoritesPage.jsx";
import AdminSubmissionsPage from "../../features/dashboard/pages/admin/AdminSubmissionsPage.jsx";
import AdminMissionEditPage from "../../features/dashboard/pages/admin/AdminMissionEditPage.jsx";
import AdminMissionCreatePage from "../../features/dashboard/pages/admin/AdminMissionCreatePage.jsx";
import AdminUsersPage from "../../features/dashboard/pages/admin/AdminUsersPage.jsx";
import ForgotPasswordPage from "../../features/auth/pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../../features/auth/pages/ResetPasswordPage.jsx";
import ChatPage from "../../features/dashboard/pages/ChatPage.jsx";
import { SearchProvider } from "../providers/SearchProvider.jsx";

// ✅ Protect dashboard routes
function ProtectedRoute({ children }) {
	const { user, initializing } = useUser();

	if (initializing) return <LoadingSpinner fullScreen />;
	if (!user) return <Navigate to="/login" replace />;

	return children;
}

function AdminRoute({ children }) {
	const { user, initializing } = useUser();

	if (initializing) return <LoadingSpinner fullScreen />;
	if (!user) return <Navigate to="/login" replace />;
	if (!user.isAdmin) return <Navigate to="/dashboard" replace />;

	return children;
}

function Router() {
	// ✅ Wrap *all* dashboard pages (user + admin) with SearchProvider
	const wrapDashboard = (PageComponent) => (
		<SearchProvider>
			<DashboardLayout>
				<PageComponent />
			</DashboardLayout>
		</SearchProvider>
	);

	const renderDashboardPage = (PageComponent) => (
		<ProtectedRoute>{wrapDashboard(PageComponent)}</ProtectedRoute>
	);

	const renderAdminDashboardPage = (PageComponent) => (
		<AdminRoute>{wrapDashboard(PageComponent)}</AdminRoute>
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

			<Route
				path="/forgot-password"
				element={
					<Layout>
						<ForgotPasswordPage />
					</Layout>
				}
			/>

			<Route
				path="/reset-password"
				element={
					<Layout>
						<ResetPasswordPage />
					</Layout>
				}
			/>

			{/* Dashboard (protected) */}
			<Route path="/dashboard" element={renderDashboardPage(DashboardHome)} />
			<Route path="/dashboard/settings" element={renderDashboardPage(DashboardSettings)} />
			<Route path="/dashboard/missions" element={renderDashboardPage(DashboardMissions)} />
			<Route path="/dashboard/missions/:id" element={renderDashboardPage(DashboardMissionDetails)} />
			<Route path="/dashboard/profile" element={renderDashboardPage(DashboardProfile)} />
			<Route path="/dashboard/activity" element={renderDashboardPage(DashboardActivity)} />
			<Route path="/dashboard/community" element={renderDashboardPage(DashboardCommunity)} />
			<Route path="/dashboard/favorites" element={renderDashboardPage(DashboardFavoritesPage)} />
			<Route path="/dashboard/chat" element={renderDashboardPage(ChatPage)} />

			{/* Admin routes (also wrapped by SearchProvider + DashboardLayout) */}
			<Route
				path="/dashboard/admin/submissions"
				element={renderAdminDashboardPage(AdminSubmissionsPage)}
			/>
			<Route
				path="/dashboard/admin/missions/:id/edit"
				element={renderAdminDashboardPage(AdminMissionEditPage)}
			/>
			<Route
				path="/dashboard/admin/missions/new"
				element={renderAdminDashboardPage(AdminMissionCreatePage)}
			/>
			<Route
				path="/dashboard/admin/users"
				element={renderAdminDashboardPage(AdminUsersPage)}
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
