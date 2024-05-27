import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AudioContext = createContext({});

const audio = new Audio();

const AudioProvider = ({ children }) => {
  const [defaultTrack, setDefaulTrack] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(defaultTrack);
  const [isPlaying, setPlaying] = useState(false);
  const [defaultPlaylists, setDefaultPlaylists] = useState([]);
  const [openPlaylistEdit, setOpenPlaylistEdit] = useState(false);
  const [menuItem, setMenuItem] = useState();
  const [activePlaylist, setActivePlaylist] = useState();
  const [activeAlbum, setActiveAlbum] = useState();
  const [activeDefPlaylist, setActDefPlaylist] = useState();
  const [activeAuthor, setActiveAuthor] = useState();
  const [playlistName, setPlaylistName] = useState();
  const [albums, setAlbums] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [playlistCountAndDuration, setPlaylistCountAndDuration] = useState();
  const [listType, setListType] = useState();
  const [listId, setListId] = useState();
  const [activeListSong, setActiveListSong] = useState();

  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/songsAndAuthors')
      .then(response => response.json())
      .then(data => {
        setSongs(data);
        setDefaulTrack(data[0]);
      });
  }, []);

  const songListPlaying = () => {
    switch (listType) {
      case 'standartList':
        break;
      case 'defaultPlaylist':
        break;
      case 'albumType':
        break;
      case 'authorType':
        break;
      case 'userPlaylist':
        break;
      case 'favoriteList':
        break;
    }
  }

  const handleToggleAudio = (track, type, listid) => {
    if (currentTrack.song_id !== track.song_id) {
      setCurrentTrack(track);
      audio.src = track.song_path;
      audio.currentTime = 0;
      audio.play();
      setPlaying(true);
      setListType(type);
      setListId(listid);
      console.log(type);
      console.log(listid);
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

  const removeSongFromPlaylist = (songId) => {
    setSongsPlaylist(prevSongs => prevSongs.filter(song => song.song_id !== songId));
  };

  const onChangeMenuItem = (item) => {
    return setMenuItem(item);
  }

  const onChangePlaylist = (item) => {
    return setActivePlaylist(item);
  }

  const onChangeAlbum = (item) => {
    return setActiveAlbum(item);
  }

  const onChangeAuthor = (item) => {
    return setActiveAuthor(item);
  }

  const onChangeDefPlaylist = (item) => {
    return setActDefPlaylist(item);
  }

  const findAlbumById = (albumId) => {
    const foundAlbum = albums.find(album => album.album_id === albumId);

    if (foundAlbum) {
      setActiveAlbum(foundAlbum);
    } else {
      console.error(`Album with ID ${albumId} not found.`);
    }
  };

  const findAuthorById = (authorId) => {
    const foundAuthor = authors.find(author => author.author_id === authorId);

    if (foundAuthor) {
      setActiveAuthor(foundAuthor);
    } else {
      console.error(`Author with ID ${authorId} not found.`);
    }
  };

  const getPlaylistName = async (id) => {
    try {
      const response = await axios.post('http://localhost:8081/getPlaylistName', { id });
      setPlaylistName(response.data[0].playlist_name);
    } catch (error) {
      console.error('Error fetching playlist name:', error);
    }
  }

  const newName = (id, inputValue) => {
    axios.post('http://localhost:8081/updatePlaylistName', { id, inputValue });
    getPlaylistName(id);
  }

  useEffect(() => {
    const fetchAlbumsAndAuthors = async () => {
      if (!menuItem) {
        try {
          const responseDefault = await axios.post('http://localhost:8081/defaultPlaylists');
          const responseAlbums = await axios.post('http://localhost:8081/albums');
          const responseAuthors = await axios.post('http://localhost:8081/authors');
          setAlbums(responseAlbums.data);
          setAuthors(responseAuthors.data);
          setDefaultPlaylists(responseDefault.data);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchAlbumsAndAuthors();
  }, [menuItem]);

  const value = {
    audio,
    songs,
    albums,
    authors,
    currentTrack,
    isPlaying,
    menuItem,
    activePlaylist,
    openPlaylistEdit,
    playlistName,
    playlistCountAndDuration,
    activeAuthor,
    activeAlbum,
    defaultPlaylists,
    activeDefPlaylist,
    listType,
    findAuthorById,
    findAlbumById,
    setPlaylistCountAndDuration,
    getPlaylistName,
    setOpenPlaylistEdit,
    removeSongFromPlaylist,
    onChangePlaylist,
    handleToggleAudio,
    onChangeMenuItem,
    onChangeAlbum,
    onChangeAuthor,
    newName,
    onChangeDefPlaylist,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
