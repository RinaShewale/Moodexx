import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../auth/hook/useauth";
import "./style/uploadsong.scss";

const UploadSong = ({ onUpload }) => {
  const { user } = useAuth();
  const [mood, setMood] = useState("happy");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedSong, setUploadedSong] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) return alert("Please select a song 🎧");
    if (!user) return alert("You must be logged in to upload a song!");

    const data = new FormData();
    data.append("song", file);
    data.append("mood", mood);

    try {
      setLoading(true);
      setProgress(0);

      const res = await axios.post(
        "https://moodexx.onrender.com/api/song",
        data,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percent);
          },
        }
      );

      const song = res.data.song;
      setUploadedSong(song);

      // Save uploaded song per user
      const storedSongs = JSON.parse(localStorage.getItem(`${user.username}_uploadedSongs`) || "[]");
      const updatedSongs = [...storedSongs, song];
      localStorage.setItem(`${user.username}_uploadedSongs`, JSON.stringify(updatedSongs));

      // Update Home immediately if callback provided
      onUpload && onUpload(updatedSongs);

      alert(`Uploaded: ${song.title} 🎉`);
      setFile(null);
      setProgress(0);
    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-wrapper">
      <h2>🎧 Upload Song</h2>

      <div className="input-group">
        <label>Select Mood</label>
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="happy">Happy 😄</option>
          <option value="sad">Sad 😢</option>
          <option value="surprised">Surprised 😲</option>
          <option value="angry">Angry 😡</option>
        </select>
      </div>

      <div className="input-group">
        <input
          type="file"
          id="fileUpload"
          accept="audio/*"
          hidden
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label htmlFor="fileUpload" className="custom-file-btn">
          🎵 Choose Song
        </label>
        {file && <p className="file-name">{file.name}</p>}
      </div>

      {loading && (
        <div className="progress-bar-wrapper">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          <p>{progress}% uploaded</p>
        </div>
      )}

      <button className="upload-btn" onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload 🚀"}
      </button>

      {uploadedSong && (
        <div className="uploaded-result">
          <h3>✅ Uploaded Song</h3>
          <p><strong>Title:</strong> {uploadedSong.title}</p>
          <p><strong>Mood:</strong> {uploadedSong.mood}</p>
          <audio controls src={uploadedSong.url}></audio>
        </div>
      )}
    </div>
  );
};

export default UploadSong;