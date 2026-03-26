import { useContext } from "react";
import { SongContext } from "../Song.context";
import { getsong } from "../Service/song.api";

export const useSong = () => {
  const context = useContext(SongContext);
  if (!context) throw new Error("useSong must be used within SongProvider");

  const { song, setSong, loading, setLoading } = context;

  const handleGetSong = async ({ mood }) => {
    try {
      setLoading(true);
      const data = await getsong({ mood });
      if (data?.song) {
        setSong(data.song);
        return data.song;
      }
      return null;
    } catch (err) {
      console.error("Song fetch error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { song, loading, handleGetSong };
};