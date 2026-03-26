import { login, register, getme, logout } from "../../auth/service/authapi";
import { useContext, useEffect } from "react";
import { AuthContext } from "../Auth.context";

export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useContext(AuthContext);

  // Register new user
  async function handleRegister({ username, email, password }) {
    setLoading(true);
    try {
      const data = await register({ username, email, password });
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  }

  // Login user
async function handleLogin({ email, password }) {
  setLoading(true);
  try {
    const res = await login({ email, password });

    if (res.success) {
      setUser(res.data.user);
    }

    return res; // ✅ MUST (nahitar undefined yet hota)

  } finally {
    setLoading(false);
  }
}


  // Get current user from backend
  async function handleGetMe() {
    if (user) return; // ✅ Prevent repeated calls if user already exists
    setLoading(true);
    try {
      const data = await getme();
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // Logout
  async function handleLogout() {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // Load user once on mount
  useEffect(() => {
    handleGetMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, loading, handleRegister, handleLogin, handleGetMe, handleLogout };
};