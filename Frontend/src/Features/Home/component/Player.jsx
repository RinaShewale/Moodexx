import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, RotateCw } from "lucide-react";
import "../component/style/player.scss";

const Player = ({ currentSong, onEnded }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Poster state to safely handle fallback
  const [posterSrc, setPosterSrc] = useState("");

  // Update posterSrc on song change
  useEffect(() => {
    if (currentSong) {
      setPosterSrc(currentSong.posterUrl || currentSong.posterurl || "/images/no-poster.png");
    }
  }, [currentSong]);

  // Time & duration tracking
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      onEnded && onEnded("forward");
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong, onEnded]);

  // Auto-play on song change
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    audioRef.current.load();
    setCurrentTime(0);
    setDuration(audioRef.current.duration || 0);

    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [currentSong]);

  // Play/pause toggle
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.play() : audio.pause();
  }, [isPlaying]);

  if (!currentSong) return <div className="large-player">No song has been uploaded</div>;

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    const newTime = (e.target.value / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const resetSong = () => {
    const audio = audioRef.current;
    audio.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleSkipBack = () => onEnded && onEnded("back");
  const handleSkipForward = () => onEnded && onEnded("forward");

  return (
    <div className="large-player">
      {/* Audio element */}
      <audio ref={audioRef} src={currentSong.url} />

      {/* Poster */}
      <div className="player-poster">
        <img
          src={posterSrc}
          alt={currentSong?.title || "poster"}
          onError={() => {
            if (posterSrc !== "/images/no-poster.png") {
              setPosterSrc("/images/no-poster.png"); // only replace once
            }
          }}
        />
      </div>

      {/* Song info */}
      <div className="player-song-info">
        <h3>{currentSong.title}</h3>
        <p>{currentSong.mood}</p>
      </div>

      {/* Progress bar */}
      <div className="player-progress">
        <div className="time">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleProgressChange}
          className="progress-bar-input"
        />
      </div>

      {/* Controls */}
      <div className="player-controls">
        <button><Shuffle size={20} /></button>
        <button onClick={handleSkipBack}><SkipBack size={20} /></button>

        <button className="play-btn" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <Pause size={28} /> : <Play size={28} />}
        </button>

        <button onClick={handleSkipForward}><SkipForward size={20} /></button>
        <button><Repeat size={20} /></button>
        <button className="reset-btn" onClick={resetSong}><RotateCw size={20} /></button>
      </div>
    </div>
  );
};

export default Player;