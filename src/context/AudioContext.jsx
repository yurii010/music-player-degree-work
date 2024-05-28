import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AudioContext = createContext({});

const audio = new Audio();

const AudioProvider = ({ children }) => {
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

  const [albumsSongs, setAlbumsSongs] = useState([]);
  const [authorsSongs, setAuthorsSongs] = useState([]);
  const [defaultPlaylistSongs, setDefaultPlaylistSongs] = useState([]);
  const [songsPlaylist, setSongsPlaylist] = useState([]);
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [songs, setSongs] = useState([]);

  const [listType, setListType] = useState();
  const [activeListSong, setActiveListSong] = useState([]);
  const [shuffle, setShuffle] = useState(false);
  const [defaultTrack, setDefaulTrack] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(defaultTrack);
  const [isPlaying, setPlaying] = useState(false);
  const [playedSongsHistory, setPlayedSongsHistory] = useState([]);
  const [repeatOne, setRepeatOne] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8081/songsAndAuthors')
      .then(response => response.json())
      .then(data => {
        setSongs(data);
        setDefaulTrack(data[0]);
      });
  }, []);

  const songListPlaying = (list) => {
    switch (list) {
      case 'standartList':
        setShuffle(false);
        setActiveListSong(songs);
        break;
      case 'defaultPlaylist':
        setShuffle(false);
        setActiveListSong(defaultPlaylistSongs);
        break;
      case 'albumType':
        setShuffle(false);
        setActiveListSong(albumsSongs);
        break;
      case 'authorType':
        setShuffle(false);
        setActiveListSong(authorsSongs);
        break;
      case 'userPlaylist':
        setShuffle(false);
        setActiveListSong(songsPlaylist);
        break;
      case 'favoriteList':
        setShuffle(false);
        setActiveListSong(favoriteSongs);
        break;
      default:
        setShuffle(false);
        setActiveListSong([]);
        break;
    }
  }

  useEffect(() => {
    if (currentTrack) {
      setPlayedSongsHistory(prevHistory => [...prevHistory, currentTrack.song_id]);
    }
  }, [currentTrack]);

  useEffect(() => {
    if (repeatOne && shuffle) {
      setRepeatOne(false);
      setShuffle(false);
    } else if (repeatOne) {
      setShuffle(false);
    } else if (shuffle) {
      setRepeatOne(false);
    }
  }, [repeatOne, shuffle, setShuffle, setRepeatOne]);
  

  const handleToggleAudio = (track, type) => {
    if (currentTrack.song_id !== track.song_id) {
      setCurrentTrack(track);
      audio.src = track.song_path;
      audio.currentTime = 0;
      audio.play();
      setPlaying(true);
      setListType(type);
      songListPlaying(type);
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

  const playRandomSong = () => {
    let remainingSongs = activeListSong.filter(song => !playedSongsHistory.includes(song.song_id));
    if (remainingSongs.length === 0) {
      setPlayedSongsHistory([]);
      remainingSongs = activeListSong;
    }
    const randomIndex = Math.floor(Math.random() * remainingSongs.length);
    const nextTrack = remainingSongs[randomIndex];
    setCurrentTrack(nextTrack);
    audio.src = nextTrack.song_path;
    audio.currentTime = 0;
    audio.play();
  };

  const playNextSong = () => {
    const remainingSongs = activeListSong.filter(song => !playedSongsHistory.includes(song.song_id));
    if (shuffle && remainingSongs.length === 0) {
      setPlayedSongsHistory([]);
    }
    if (shuffle) {
      playRandomSong();
    } else {
      const currentIndex = activeListSong.findIndex(song => song.song_id === currentTrack.song_id);
      const nextIndex = (currentIndex + 1) % activeListSong.length;
      const nextTrack = activeListSong[nextIndex];
      if (repeatOne) {
        setCurrentTrack(currentTrack);
        audio.src = currentTrack.song_path;
        audio.currentTime = 0;
        audio.play();
      } else {
        setCurrentTrack(nextTrack);
        audio.src = nextTrack.song_path;
        audio.currentTime = 0;
        audio.play();
      }
    }
  };

  const playPreviousSong = () => {
    if (shuffle) {
      const lastPlayedSongIndex = playedSongsHistory.length - 2;
      if (lastPlayedSongIndex >= 0) {
        const lastPlayedSongId = playedSongsHistory[lastPlayedSongIndex];
        const lastPlayedSong = activeListSong.find(song => song.song_id === lastPlayedSongId);
        if (lastPlayedSong) {
          setCurrentTrack(lastPlayedSong);
          audio.src = lastPlayedSong.song_path;
          audio.currentTime = 0;
          audio.play();
          setPlayedSongsHistory(prevHistory => prevHistory.slice(0, -1));
        }
      }
    } else {
      const currentIndex = activeListSong.findIndex(song => song.song_id === currentTrack.song_id);
      const prevIndex = (currentIndex - 1 + activeListSong.length) % activeListSong.length;
      const prevTrack = activeListSong[prevIndex];
      if (repeatOne) {
        setCurrentTrack(currentTrack);
        audio.src = currentTrack.song_path;
        audio.currentTime = 0;
        audio.play();
      } else {
        setCurrentTrack(prevTrack);
        audio.src = prevTrack.song_path;
        audio.currentTime = 0;
        audio.play();
      }
    }
  };


  const toggleShuffle = () => {
    if (!shuffle) {
      setPlayedSongsHistory([]);
    }
    setShuffle(!shuffle);
  };

  const toggleRepeatOne = () => {
    setRepeatOne(!repeatOne);
  };

  useEffect(() => {
    if (shuffle && currentTrack) {
      setPlayedSongsHistory(prevHistory => [...prevHistory, currentTrack.song_id]);
    }
  }, [currentTrack, shuffle]);

  useEffect(() => {
    audio.addEventListener('ended', playNextSong);
    return () => {
      audio.removeEventListener('ended', playNextSong);
    };
  }, [currentTrack, activeListSong, shuffle]);

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
    playNextSong,
    playPreviousSong,

    repeatOne, toggleRepeatOne,
    shuffle, toggleShuffle,

    songs,
    albumsSongs, setAlbumsSongs,
    authorsSongs, setAuthorsSongs,
    songsPlaylist, setSongsPlaylist,
    favoriteSongs, setFavoriteSongs,
    defaultPlaylistSongs, setDefaultPlaylistSongs,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
