import { useContext, useState, useEffect } from "react";
import { AudioContext } from "../context/AudioContext";
import Track from "../track/track";
import axios from "axios";
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
    <div className="bg-[#212121] h-full p-2 text-white">
      <div className='bg-[#292929] rounded-2xl h-full p-2 flex flex-col overflow-auto'>
        <div className="flex flex-row border-b-2 border-white m-3">
          <img src={activeAuthor.author_photo} alt={activeAuthor.author_name} className="w-36" />
          <div className="flex flex-row items-center justify-center m-3 gap-4">
            <p className="text-4xl">{activeAuthor.author_name}</p>
          </div>
        </div>
        <div className='my-3'>
          {authorsSongs.map((track, index) => (
            <Track key={index} {...track} playlistType="authorType" />
          ))}
        </div>
        <div className="m-3">
          {authorAlbums.map((album, index) => (
            <div className="-m-3" onClick={() => { onChangeMenuItem('album'); onChangeAlbum(album); }} key={`${album.album_id}-${index}`}>
              <Album {...album} />
            </div>))}
        </div>
      </div>
    </div>
  );
};

export default AuthorPage;