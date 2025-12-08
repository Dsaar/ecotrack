// src/app/providers/UserProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  login as loginApi,
  register as registerApi,
  getCurrentUser,
} from "../../services/authService.js";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Restore user from token on first load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setInitializing(false);
      return;
    }

    (async () => {
      try {
        const data = await getCurrentUser();
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

  const refreshUser = async () => {
    try {
      const data = await getCurrentUser();
      const resolvedUser = data.user || data;
      setUser(resolvedUser);
      return resolvedUser;
    } catch (err) {
      console.error("Failed to refresh current user:", err);
      throw err;
    }
  };

  const login = async (email, password) => {
    const data = await loginApi({ email, password });
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    try {
      const me = await getCurrentUser();
      const resolvedUser = me.user || me;
      setUser(resolvedUser);
      return { ...data, user: resolvedUser };
    } catch (err) {
      console.warn("login: fallback to user from login response", err);
      setUser(data.user || null);
      return data;
    }
  };

  const register = async (payload) => {
    const data = await registerApi(payload);
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    try {
      const me = await getCurrentUser();
      const resolvedUser = me.user || me;
      setUser(resolvedUser);
      return { ...data, user: resolvedUser };
    } catch (err) {
      console.warn("register: fallback to user from register response", err);
      setUser(data.user || null);
      return data;
    }
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
        refreshUser,      // 👈 new helper
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export default UserProvider;
