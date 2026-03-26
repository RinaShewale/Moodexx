import React, { useState, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import { useAuth } from "../../auth/hook/useauth";
import { useNavigate } from "react-router-dom";
import "./style/profile.scss";

const moodEmoji = {
  happy: "😄",
  sad: "😢",
  angry: "😡",
  calm: "😌",
  neutral: "😐",
  surprised: "😲",
};

const moodColors = {
  happy: "#facc15",
  sad: "#3b82f6",
  angry: "#ef4444",
  calm: "#14b8a6",
  neutral: "#9ca3af",
  surprised: "#f472b6",
};

export default function Profile() {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const [currentMood, setCurrentMood] = useState(
    localStorage.getItem("latestMood") || "neutral"
  );

  const [todayHistory, setTodayHistory] = useState(
    JSON.parse(
      localStorage.getItem(`${user?.username || "guest"}_moodHistory`) || "[]"
    ).filter((e) => e.date === new Date().toISOString().split("T")[0])
  );

  // Simulate mood change every 10s
  useEffect(() => {
    const moods = Object.keys(moodEmoji);
    const interval = setInterval(() => {
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      setCurrentMood(randomMood);
      localStorage.setItem("latestMood", randomMood);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="futuristic-profile">
      <div className="profile-card">
        {/* Avatar & Current Mood */}
        <div className="avatar">
          <User size={90} />
          <span className={`mood-badge ${currentMood}`}>
            {moodEmoji[currentMood]}
          </span>
        </div>

        {/* Username & Bio */}
        <h2 className="username">{user?.username || "Guest"}</h2>
        <p className="bio">
          Welcome to your mood-driven AI dashboard. Keep tracking your emotions. ✨
        </p>

        {/* Stats */}
        <div className="futuristic-stats">
          <div className="stat-card">
            <h4>Current Mood</h4>
            <p className={`mood-display ${currentMood}`}>
              {moodEmoji[currentMood]}{" "}
              {currentMood.charAt(0).toUpperCase() + currentMood.slice(1)}
            </p>
          </div>
          <div className="stat-card">
            <h4>Mood Today</h4>
            <p>{todayHistory.length} detections</p>
          </div>
        </div>

        {/* Holographic timeline */}
        <div className="mood-timeline">
          {todayHistory.map((entry, idx) => (
            <span
              key={idx}
              className="timeline-dot"
              style={{ backgroundColor: moodColors[entry.mood] }}
              title={`${entry.mood} @ ${entry.time}`}
            ></span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="actions">
          {user && (
            <button
              className="logout-btn"
              onClick={async () => {
                await handleLogout();
                navigate("/login");
              }}
            >
              <LogOut size={18} /> Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}