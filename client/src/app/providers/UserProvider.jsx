// src/app/providers/UserProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
	login as loginApi,
	register as registerApi,
	getCurrentUser,
} from "../../services/authService.js";

const UserContext = createContext(null);

export default function UserProvider({ children }) {
	const [user, setUser] = useState(null);
	const [initializing, setInitializing] = useState(true);

	// On first load, if there is a token, try to fetch the current user
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			setInitializing(false);
			return;
		}

		(async () => {
			try {
				const data = await getCurrentUser();
				// backend may return { user } or direct user object
				const resolvedUser = data.user || data;
				setUser(resolvedUser);
			} catch (err) {
				console.error("Failed to load current user:", err);
				localStorage.removeItem("token");
				setUser(null);
			} finally {
				setInitializing(false);
			}
		})();
	}, []);

	const login = async (email, password) => {
		const data = await loginApi({ email, password });
		// Expecting data = { token, user }
		if (data.token) {
			localStorage.setItem("token", data.token);
		}
		setUser(data.user || null);
		return data;
	};

	const register = async (payload) => {
		const data = await registerApi(payload);
		if (data.token) {
			localStorage.setItem("token", data.token);
		}
		setUser(data.user || null);
		return data;
	};

	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
	};

	return (
		<UserContext.Provider
			value={{
				user,
				initializing,
				login,
				register,
				logout,
			}}
		>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	return useContext(UserContext);
}
