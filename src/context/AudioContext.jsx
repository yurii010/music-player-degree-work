import { createContext, useState, useEffect } from "react";

export const AudioContext = createContext({});

const AudioProvider = ({ children }) => {
  const [songsAndAuthors, setSongsAndAuthors] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setPlaying] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8081/songsAndAuthors')
      .then(response => response.json())
      .then(data => {
        return setSongsAndAuthors(data);
      });
  });

  useEffect(() => {
    if (currentTrack) {
      const audio = new Audio(currentTrack.song_path);
      if (isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [currentTrack, isPlaying]);

  const handleToggleAudio = (track) => {
    if (!currentTrack || currentTrack.song_id !== track.song_id) {
      setCurrentTrack(track);
      setPlaying(true);
    } else {
      setPlaying(!isPlaying);
    }
  };

  const value = { songsAndAuthors, currentTrack, isPlaying, handleToggleAudio };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
