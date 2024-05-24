import { useContext, useState, useEffect } from "react";
import { AudioContext } from "../context/AudioContext";
import Track from "../track/track";
import axios from "axios";
import { Stack } from "@mui/material";
import Album from '../track/albums';

const AuthorPage = () => {
  const { activeAuthor, albums, onChangeMenuItem, onChangeAlbum, authorsSongs, setAuthorsSongs } = useContext(AudioContext);
  const [authorAlbums, setAuthorAlbums] = useState([]);

  if (!activeAuthor) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    if (!activeAuthor) return;
    const fetchSongs = async () => {
      try {
        const response = await axios.post('http://localhost:8081/songsByAuthor', { author_id: activeAuthor.author_id });
        setAuthorsSongs(response.data);
        const authorAlbum = albums.filter(album => album.author_id === activeAuthor.author_id);
        setAuthorAlbums(authorAlbum);
      } catch (error) {
        console.error('Error fetching playlist songs:', error);
      }
    };
    fetchSongs();
  }, [activeAuthor, setAuthorsSongs]);

  return (
    <Stack>
      <Stack>
        <img src={activeAuthor.author_photo} alt={activeAuthor.author_name} width="50" />
        <span>{activeAuthor.author_name}</span>
      </Stack>
      <Stack className="list">
        {authorsSongs.map((track, index) => (
          <Track key={index} {...track} />
        ))}
      </Stack>
      <Stack alignItems="center" flexDirection={'row'} justifyContent={'center'} columnGap={'10px'}>
        {authorAlbums.map((album, index) => (
          <div onClick={() => { onChangeMenuItem('album'); onChangeAlbum(album); }} key={`${album.album_id}-${index}`}>
            <Album {...album} />
          </div>))}
      </Stack>
    </Stack>
  );
};

export default AuthorPage;