import { useContext, useState, useEffect } from "react";
import { AudioContext } from "../context/AudioContext";
import Track from "../track/track";
import axios from "axios";
import secondsToMMSS from "../utils/secondsToMMSS";

const AlbumPage = () => {
  const { activeAlbum, albumsSongs, setAlbumsSongs } = useContext(AudioContext);
  const [songCount, setSongCount] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    if (!activeAlbum) return;
    const fetchSongs = async () => {
      try {
        const response = await axios.post('http://localhost:8081/songsByAlbum', { album_id: activeAlbum.album_id });
        const songs = response.data;
        const duration = songs.reduce((total, song) => total + song.song_duration, 0);
        setAlbumsSongs(songs);
        setSongCount(songs.length);
        setTotalDuration(secondsToMMSS(duration));
      } catch (error) {
        console.error('Error fetching playlist songs:', error);
      }
    };
    fetchSongs();
  }, [activeAlbum, setAlbumsSongs]);

  return (
    <div>
      <div>
        <img src={activeAlbum.album_photo} alt={activeAlbum.album_name} width="50" />
        <span>{activeAlbum.album_name}</span>
      </div>
      <div>
        <span>Кількість пісень: {songCount}</span><br />
        <span>Тривалість: {totalDuration} seconds</span>
      </div>
      <div className="list">
        {albumsSongs.map((track, index) => (
          <Track key={index} {...track} />
        ))}
      </div>
    </div>
  );
};

export default AlbumPage;
