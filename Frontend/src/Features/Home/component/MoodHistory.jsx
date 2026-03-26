import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/hook/useauth";
import "./style/moodhistory.scss";

const moodEmoji = {
  happy: "😄",
  sad: "😢",
  angry: "😡",
  calm: "😌",
  neutral: "😐",
  surprised: "😲",
};

export default function MoodHistory() {
  const { user } = useAuth();
  const userMoodKey = user ? `${user.username}_moodHistory` : "moodHistory";

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(userMoodKey);
    return saved ? JSON.parse(saved) : [];
  });

  // Sync with localStorage
  useEffect(() => {
    if (user) localStorage.setItem(userMoodKey, JSON.stringify(history));
  }, [history, user]);

  const handleDelete = (index) => {
    setHistory(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => setHistory([]);

  return (
    <div className="mood-history-dashboard">
      <div className="header">
        <h2>Mood History</h2>
        {history.length > 0 && (
          <button className="clear-btn" onClick={handleClearAll}>
            Clear All 🗑️
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="no-history">No mood detected yet 😅</p>
      ) : (
        <ul className="history-list">
          {history.map((item, idx) => (
            <li key={idx} className="history-item">
              <span className="emoji">{moodEmoji[item.mood] || "❓"}</span>
              <span className="label">{item.mood.toUpperCase()}</span>
              <span className="time">{item.time}</span>
              <button className="delete-btn" onClick={() => handleDelete(idx)}>🗑️</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}