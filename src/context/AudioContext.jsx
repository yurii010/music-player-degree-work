import { createContext, useState, useEffect } from "react";

export const AudioContext = createContext({});

const audio = new Audio();

const AudioProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [defaultTrack, setDefaulTrack] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(defaultTrack);
  const [isPlaying, setPlaying] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8081/songsAndAuthors')
      .then(response => response.json())
      .then(data => {
        setSongs(data);
        setDefaulTrack(data[0]);
      });
  }, []);

  const handleToggleAudio = (track) => {
    if (currentTrack.song_id !== track.song_id) {
      setCurrentTrack(track);
      audio.src = track.song_path;
      audio.currentTime = 0;
      audio.play();
      setPlaying(true);
    } else {
      if (isPlaying) {
        audio.pause();
        setPlaying(false);
      } else {
        audio.play();
        setPlaying(true);
      }
    }
  };
  
  const value = { audio, songs, currentTrack, isPlaying, handleToggleAudio };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
