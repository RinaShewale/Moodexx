import React, { useState, useEffect, useCallback } from "react";
import { Home as HomeIcon, User, Heart, Star, FileText, Search, Bell, Menu } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import FaceExpression from "../../Expression/components/FaceExpression";
import Player from "../component/Player";
import { useAuth } from "../../auth/hook/useauth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../Sheared/home.scss";

const moodEmoji = {
  happy: "😄",
  sad: "😢",
  angry: "😡",
  calm: "😌",
  neutral: "😐",
  surprised: "😲",
};

const getArtistsFromHistory = (playedSongs) => {
  const map = new Map();
  playedSongs.forEach((song) => {
    if (!map.has(song.artist)) map.set(song.artist, []);
    map.get(song.artist).push(song);
  });
  return Array.from(map.entries()).map(([name, songs]) => ({ name, songs }));
};

export default function Home() {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const userMoodKey = user ? `${user.username}_moodHistory` : "moodHistory";
  const playedSongsKey = user ? `${user.username}_playedSongs` : "playedSongs";
  const uploadedSongsKey = "uploadedSongs"; // ✅ global for all users
  const latestSongKey = user ? `${user.username}_latestSong` : "latestSong";
  const notificationKey = user ? `${user.username}_notifications` : "notifications";

  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem(userMoodKey) || "[]"));
  const [playedSongs, setPlayedSongs] = useState(() => JSON.parse(localStorage.getItem(playedSongsKey) || "[]"));
  const [uploadedSongs, setUploadedSongs] = useState(() =>
    JSON.parse(localStorage.getItem(uploadedSongsKey) || "[]")
  );
  const [currentSong, setCurrentSong] = useState(() => JSON.parse(localStorage.getItem(latestSongKey) || "null"));
  const [today, setToday] = useState(new Date().toISOString().split("T")[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastLock, setToastLock] = useState(false);

  const [notificationCount, setNotificationCount] = useState(() => {
    return parseInt(localStorage.getItem(notificationKey)) || 0;
  });

  const [lastTriggerTime, setLastTriggerTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = new Date().toISOString().split("T")[0];
      if (currentDate !== today) setToday(currentDate);
    }, 60000);
    return () => clearInterval(interval);
  }, [today]);

  useEffect(() => { localStorage.setItem(userMoodKey, JSON.stringify(history)); }, [history, user]);
  useEffect(() => { localStorage.setItem(playedSongsKey, JSON.stringify(playedSongs)); }, [playedSongs, user]);
  useEffect(() => { localStorage.setItem(uploadedSongsKey, JSON.stringify(uploadedSongs)); }, [uploadedSongs]);

  useEffect(() => {
    const handleFocus = () => {
      const saved = parseInt(localStorage.getItem(notificationKey)) || 0;
      setNotificationCount(saved);
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [notificationKey]);

  const handlePlaySong = useCallback(
    (song) => {
      if (!song) return;
      setCurrentSong(song);
      setPlayedSongs((prev) => {
        const exists = prev.find((s) => s.id === song.id);
        const updated = exists ? prev : [...prev, song];
        localStorage.setItem(latestSongKey, JSON.stringify(song));
        return updated;
      });
    },
    [latestSongKey]
  );

  const handleMoodDetect = useCallback(
    (mood) => {
      if (!user || !mood || mood === "Detecting...") return;

      const nowTime = Date.now();
      if (nowTime - lastTriggerTime < 2000) return;
      setLastTriggerTime(nowTime);

      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      const time = `${hours}:${minutes} ${ampm}`;
      const todayDate = now.toISOString().split("T")[0];

      const newEntry = { mood, time, value: Math.floor(Math.random() * 100), date: todayDate };
      setHistory(prev => [newEntry, ...prev]);
      localStorage.setItem("latestMood", mood);

      // ✅ Use global uploadedSongs for all users
      const allSongs = [...uploadedSongs, ...playedSongs];
      const song = allSongs.find(s => s.mood?.toLowerCase() === mood.toLowerCase());
      if (song) handlePlaySong(song);

      const updatedCount = (parseInt(localStorage.getItem(notificationKey)) || 0) + 1;
      localStorage.setItem(notificationKey, updatedCount);
      setNotificationCount(updatedCount);

      if (!toastLock) {
        setToastLock(true);
        toast.info("You have something interesting! Please check Messages.", {
          position: "top-right",
          autoClose: 3500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            background: "#1a0b2e",
            color: "#fff",
            border: "1px solid #9333ea",
            borderRadius: "10px",
            fontWeight: "bold",
            boxShadow: "0 0 10px rgba(168,85,247,0.5)",
          },
          onClose: () => setToastLock(false),
        });
      }
    },
    [user, uploadedSongs, playedSongs, handlePlaySong, lastTriggerTime, toastLock]
  );

  const handleUploadSong = (song) => {
    if (!song) return;
    const newSong = {
      ...song,
      uploadedBy: user?.username || "Guest",
      id: Date.now(),
    };
    setUploadedSongs(prev => {
      const updated = [...prev, newSong];
      localStorage.setItem(uploadedSongsKey, JSON.stringify(updated));
      return updated;
    });
    toast.success(`Song "${song.title}" uploaded successfully! 🎵`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: "#1a0b2e", padding: "10px", borderRadius: "10px", border: "1px solid #9333ea", color: "#fff" }}>
          <p><strong>Time:</strong> {data.time}</p>
          <p><strong>Mood:</strong> {data.mood} {moodEmoji[data.mood]}</p>
        </div>
      );
    }
    return null;
  };

  const todayHistory = history.filter((entry) => entry.date === today);
  const artists = getArtistsFromHistory(playedSongs);

  return (
    <div className="music-dashboard">
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        style={{ top: "50px", right: "20px", minWidth: "200px" }}
      />

      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <Menu size={28} color="#fff" />
      </button>

      <div className={`left-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="user-profile">
          <div className="avatar"><User size={32} /></div>
          <h2 className="username">{user?.username || "Guest"}</h2>
        </div>

        <div className="menu-section">
          <h3>Menu</h3>
          <nav>
            <button className="active"><HomeIcon size={20} /> Dashboard</button>
            <button onClick={() => navigate("/profile")}><User size={20} /> Profile</button>
            {!user && <>
              <button onClick={() => navigate("/login")}><User size={20} /> Login</button>
              <button onClick={() => navigate("/register")}><User size={20} /> Sign Up</button>
            </>}
          </nav>
        </div>

        <div className="library-section">
          <h3>Insights</h3>
          <nav>
            <button onClick={() => navigate("/mood-history")}><Heart size={20} /> Mood History</button>
            <button onClick={() => navigate("/messages")}><Star size={20} /> Messages</button>
            <button onClick={() => navigate("/upload")}><FileText size={20} /> Upload</button>
          </nav>
          {user && <button className="logout-btn" onClick={async () => { await handleLogout(); navigate("/login"); }}>Logout</button>}
        </div>
      </div>

      <div className="main-content">
        <div className="header">
          <h1>Moodex</h1>
          <div className="header-actions">

            <button
              className="notification-btn"
              onClick={() => {
                localStorage.setItem(notificationKey, "0");
                setNotificationCount(0);
                setTimeout(() => {
                  navigate("/messages", { replace: true });
                }, 50);
              }}
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </button>

            <div className="search-wrapper"><Search size={16} /></div>
          </div>
        </div>

        <div className="mood-detection-banner">
          <FaceExpression onDetect={handleMoodDetect} />
        </div>

        <div className="mood-graph-section">
          <h3>Today's Mood Analytics</h3>
          {todayHistory.length > 0 ? (
            <div className="graph-wrapper" style={{ overflowX: "auto" }}>
              <div style={{ width: `${Math.max(todayHistory.length * 60, 600)}px`, height: "250px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={todayHistory}>
                    <XAxis dataKey="time" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <p style={{ color: "#aaa", marginTop: "20px" }}>No moods detected today 😅</p>
          )}
        </div>
      </div>

      <div className="right-sidebar">
        <Player currentSong={currentSong} />
        {currentSong?.mood && (
          <div className="mood-song-list">
            <h4>Matching Songs</h4>
            <div className="playlist-buttons">
              {Array.from(
                new Map(
                  uploadedSongs
                    .filter(s => s.mood?.toLowerCase() === currentSong.mood.toLowerCase())
                    .map(s => [s.title, s])
                ).values()
              ).map((song) => (
                <button
                  key={song.id}
                  onClick={() => setCurrentSong(song)}
                  className={currentSong.id === song.id ? "active" : ""}
                >
                  {song.title} {song.uploadedBy ? `by ${song.uploadedBy}` : ""}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}