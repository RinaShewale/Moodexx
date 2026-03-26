import { login, register, getme, logout } from "../../auth/service/authapi";
import { useContext, useEffect } from "react";
import { AuthContext } from "../Auth.context";

export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useContext(AuthContext);

  // ✅ REGISTER new user
  async function handleRegister({ username, email, password }) {
    setLoading(true);
    try {
      const res = await register({ username, email, password });
      if (res.success) setUser(res.data.user);
      return res; // 🔹 MUST return
    } finally {
      setLoading(false);
    }
  }

  // ✅ LOGIN
  async function handleLogin({ email, password }) {
    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res.success) setUser(res.data.user);
      return res; // 🔹 MUST return
    } finally {
      setLoading(false);
    }
  }

  // ✅ GET CURRENT USER
  async function handleGetMe() {
    if (user) return;
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

  // ✅ LOGOUT
  async function handleLogout() {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetMe();
  }, []);

  return { user, loading, handleRegister, handleLogin, handleGetMe, handleLogout };
};