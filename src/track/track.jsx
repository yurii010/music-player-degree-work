import { useContext, useState, useEffect } from "react";
import { AudioContext } from "../context/AudioContext";
import { PlayArrow, Pause } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import secondsToMMSS from "../utils/secondsToMMSS";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from "axios";
import TrackMenu from './trackMenu';

const Track = (props) => {
    const { song_id, song_name, song_author, song_image, song_duration, author_id, album_id, playlistType, removeFromFavorites } = props;
    const { handleToggleAudio, currentTrack, isPlaying, findAuthorById, onChangeMenuItem, albums, findAlbumById } = useContext(AudioContext);
    const [isFavorite, setIsFavorite] = useState(false);
    const [albumName, setAlbumName] = useState();
    const formattedDuration = secondsToMMSS(song_duration);
    const isCurrentTrack = currentTrack.song_id === song_id;
    const uid = localStorage.getItem('uid');

    const getAlbumNameFromId = (albumId) => {
        const album = albums.find(album => album.album_id == albumId);
        return (album ? setAlbumName(album.album_name) : setAlbumName(''));
    }

    useEffect(() => {
        const checkIfFavorite = async () => {
            try {
                const response = await axios.post('http://localhost:8081/userFavoriteSongs', { uid });
                const favoriteSongs = response.data;
                const isSongInFavorites = favoriteSongs.some(song => song.song_id === song_id);
                setIsFavorite(isSongInFavorites);
            } catch (error) {
                console.error('Error checking if song is favorite:', error);
            }
        };
        getAlbumNameFromId(album_id);
        checkIfFavorite();
    }, [uid, song_id]);

    const handleFavoriteClick = async () => {
        try {
            if (isFavorite) {
                await axios.post('http://localhost:8081/removeFromFavorites', { uid, song_id });
                setIsFavorite(false);
                if (playlistType === 'favoriteList') {
                    removeFromFavorites(song_id);
                }
            } else {
                await axios.post('http://localhost:8081/addToFavorites', { uid, song_id });
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Error updating favorites:', error);
        }
    };

    const handleAuthorClick = (author_id) => {
        findAuthorById(author_id);
        onChangeMenuItem('author');
    };

    const handleAlbumClick = (albumId) => {
        findAlbumById(albumId);
        onChangeMenuItem('album');
    }

    return (
        <div className="flex items-center p-1">
            <div className="mr-4">
                <IconButton onClick={() => handleToggleAudio(props, playlistType)}>
                    {isCurrentTrack && isPlaying ? <Pause className="text-white" /> : <PlayArrow className="text-white" />}
                </IconButton>
            </div>
            <div className="mr-4">
                <img className="w-16 h-16" src={song_image} alt={song_name} />
            </div>
            <div className="flex-1 min-w-0 mr-4">
                <p className="text-lg font-semibold truncate">{song_name}</p>
                <p className="text-sm text-white hover:text-blue-600 cursor-pointer" onClick={() => handleAuthorClick(author_id)}>{song_author}</p>
            </div>
            <div className="text-white hover:text-blue-600 cursor-pointer mr-4" onClick={() => handleAlbumClick(album_id)}>
                {albumName}
            </div>
            <div className="mr-4">
                <p className="text-sm text-gray-500">{formattedDuration}</p>
            </div>
            <div className="mr-4">
                <IconButton onClick={handleFavoriteClick}>
                    {isFavorite ? <FavoriteIcon className="text-red-500" /> : <FavoriteBorderIcon className="text-white" />}
                </IconButton>
            </div>
            <div>
                <TrackMenu songId={song_id} albumId={album_id} />
            </div>
        </div>
    );
};

export default Track;
