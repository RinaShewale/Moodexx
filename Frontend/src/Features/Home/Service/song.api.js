import axios from "axios";

const api = axios.create({
  baseURL: "https://moodex.onrender.com",
  withCredentials: true
});

export async function getsong({ mood }) {
  try {
    const response = await api.get(`/api/song?mood=${encodeURIComponent(mood)}`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch song:", err);
    return { song: null };
  }
}