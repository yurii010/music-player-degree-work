import { useContext, useState, useEffect } from "react";
import { AudioContext } from "../context/AudioContext";
import Track from "../track/track";
import axios from "axios";
import secondsToMMSS from '../utils/secondsToTime';

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
    <div className="bg-[#212121] h-full p-2 text-white">
      <div className='bg-[#292929] rounded-2xl h-full p-2 flex flex-col'>
        <div className="flex flex-row border-b-2 border-white m-3">
          <img src={activeAlbum.album_photo} alt={activeAlbum.album_name} className="w-36" />
          <div className="flex flex-row items-center justify-center m-3 gap-4">
            <p className="text-4xl">{activeAlbum.album_name}</p>
            <div>
              <p>Кількість треків {songCount}</p>
              <p>Час програвання {totalDuration}</p>
            </div>
          </div>
        </div>
        <div className='overflow-auto my-3'>
          {albumsSongs.map((track, index) => (
            <Track key={index} {...track} playlistType="albumType" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlbumPage;
