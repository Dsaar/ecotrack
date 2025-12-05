// src/app/providers/UserProvider.jsx
import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
	// Synchronously initialize user from localStorage
	const [user, setUser] = useState(() => {
		try {
			const stored = localStorage.getItem("ecotrack_user");
			return stored ? JSON.parse(stored) : null;
		} catch (err) {
			console.error("Failed to parse user from localStorage:", err);
			return null;
		}
	});

	const login = (userData) => {
		setUser(userData);
		try {
			localStorage.setItem("ecotrack_user", JSON.stringify(userData));
		} catch (err) {
			console.error("Failed to save user to localStorage:", err);
		}
	};

	const logout = () => {
		setUser(null);
		try {
			localStorage.removeItem("ecotrack_user");
		} catch (err) {
			console.error("Failed to remove user from localStorage:", err);
		}
	};

	const value = {
		user,
		isAuthenticated: !!user,
		login,
		logout,
	};

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
	const ctx = useContext(UserContext);
	if (!ctx) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return ctx;
}

export default UserProvider;
