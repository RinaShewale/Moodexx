import axios from "axios";

const api = axios.create({
  baseURL: "https://moodexx.onrender.com",
  withCredentials: true
});

export async function register({ email, password, username }) {
  const response = await api.post("/api/auth/register", { email, password, username });
  return response.data;
}

export async function login({ email, password }) {
  try {
    const response = await api.post("/api/auth/login", { email, password });

    return {
      success: true,
      data: response.data
    };

  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Login failed"
    };
  }
}

export async function getme() {
  try {
    const response = await api.get("/api/auth/get-me");
    return response.data;
  } catch {
    return { user: null };
  }
}

export async function logout() {
  const response = await api.get("/api/auth/logout");
  return response.data;
}