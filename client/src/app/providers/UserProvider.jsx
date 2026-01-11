// src/app/providers/UserProvider.jsx
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  login as loginApi,
  register as registerApi,
  getCurrentUser,
} from "../../services/authService.js";

const UserContext = createContext(null);

// ✅ Choose ONE key and use it everywhere
const TOKEN_KEY = "myToken"; // <- if your key is actually "my token", change to: "my token"

// Match your backend JWT_EXPIRES_IN=4h
const INACTIVITY_MS = 4 * 60 * 60 * 1000; // 4 hours

function safeParseJwt(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    // base64url -> base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const inactivityTimeoutRef = useRef(null);
  const jwtExpiryIntervalRef = useRef(null);

  const getToken = () => localStorage.getItem(TOKEN_KEY);

  const isAuthed = !!getToken() && !!user;

  const clearTimers = () => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
      inactivityTimeoutRef.current = null;
    }
    if (jwtExpiryIntervalRef.current) {
      clearInterval(jwtExpiryIntervalRef.current);
      jwtExpiryIntervalRef.current = null;
    }
  };

  const doLogout = async ({ reason } = {}) => {
    // ✅ remove the real token key
    localStorage.removeItem(TOKEN_KEY);

    // ✅ optional: cleanup legacy key if it exists from older code
    localStorage.removeItem("token");

    localStorage.removeItem("lastActivityAt");
    setUser(null);
    clearTimers();

    if (reason) {
      // console.log("[auth] logout reason:", reason);
    }
  };

  const bumpActivity = () => {
    localStorage.setItem("lastActivityAt", String(Date.now()));
  };

  const scheduleInactivityLogout = () => {
    if (!getToken()) return;

    if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);

    const last = Number(localStorage.getItem("lastActivityAt") || Date.now());
    const elapsed = Date.now() - last;
    const remaining = Math.max(0, INACTIVITY_MS - elapsed);

    inactivityTimeoutRef.current = setTimeout(() => {
      doLogout({ reason: "inactivity" });
    }, remaining);
  };

  const startActivityTracking = () => {
    if (!localStorage.getItem("lastActivityAt")) bumpActivity();

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click"];

    let lastWrite = 0;
    const onAnyActivity = () => {
      const now = Date.now();
      if (now - lastWrite > 2500) {
        lastWrite = now;
        bumpActivity();
      }
      scheduleInactivityLogout();
    };

    events.forEach((ev) => window.addEventListener(ev, onAnyActivity, { passive: true }));

    const onStorage = (e) => {
      if (e.key === "lastActivityAt") {
        scheduleInactivityLogout();
      }
      if (e.key === TOKEN_KEY && !e.newValue) {
        doLogout({ reason: "other-tab" });
      }
      // optional legacy: if some tab removes "token"
      if (e.key === "token" && !e.newValue) {
        doLogout({ reason: "other-tab-legacy" });
      }
    };
    window.addEventListener("storage", onStorage);

    scheduleInactivityLogout();

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, onAnyActivity));
      window.removeEventListener("storage", onStorage);
    };
  };

  const startJwtExpiryWatcher = () => {
    if (jwtExpiryIntervalRef.current) clearInterval(jwtExpiryIntervalRef.current);

    jwtExpiryIntervalRef.current = setInterval(() => {
      const token = getToken();
      if (!token) return;

      const payload = safeParseJwt(token);
      const expSeconds = payload?.exp;
      if (!expSeconds) return;

      const nowSeconds = Math.floor(Date.now() / 1000);
      if (nowSeconds >= expSeconds) {
        doLogout({ reason: "token-expired" });
      }
    }, 10_000);
  };

  // Restore user from token on first load
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setInitializing(false);
      return;
    }

    (async () => {
      try {
        const data = await getCurrentUser();
        const resolvedUser = data.user || data;
        setUser(resolvedUser);
        bumpActivity();
      } catch (err) {
        console.error("Failed to load current user:", err);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem("token"); // legacy
        setUser(null);
      } finally {
        setInitializing(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for apiClient "forced logout" events (e.g. 401)
  useEffect(() => {
    const onForcedLogout = (e) => {
      doLogout({ reason: e?.detail?.reason || "forced" });
    };
    window.addEventListener("auth:logout", onForcedLogout);
    return () => window.removeEventListener("auth:logout", onForcedLogout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start/stop timers + listeners when auth state changes
  useEffect(() => {
    clearTimers();

    if (!getToken() || !user) return;

    const cleanupActivity = startActivityTracking();
    startJwtExpiryWatcher();

    return () => {
      cleanupActivity?.();
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const refreshUser = async () => {
    const data = await getCurrentUser();
    const resolvedUser = data.user || data;
    setUser(resolvedUser);
    return resolvedUser;
  };

  const login = async (email, password) => {
    const data = await loginApi({ email, password });

    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      // optional: remove legacy
      localStorage.removeItem("token");
      bumpActivity();
    }

    try {
      const me = await getCurrentUser();
      const resolvedUser = me.user || me;
      setUser(resolvedUser);
      bumpActivity();
      return { ...data, user: resolvedUser };
    } catch (err) {
      console.warn("login: fallback to user from login response", err);
      setUser(data.user || null);
      bumpActivity();
      return data;
    }
  };

  const register = async (payload) => {
    const data = await registerApi(payload);

    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.removeItem("token");
      bumpActivity();
    }

    try {
      const me = await getCurrentUser();
      const resolvedUser = me.user || me;
      setUser(resolvedUser);
      bumpActivity();
      return { ...data, user: resolvedUser };
    } catch (err) {
      console.warn("register: fallback to user from register response", err);
      setUser(data.user || null);
      bumpActivity();
      return data;
    }
  };

  const logout = () => doLogout({ reason: "manual" });

  const value = useMemo(
    () => ({
      user,
      initializing,
      login,
      register,
      logout,
      refreshUser,
      isAuthed,
    }),
    [user, initializing, isAuthed]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}

export default UserProvider;
