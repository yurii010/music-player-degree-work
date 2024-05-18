import { useContext, useState, useEffect } from "react";
import { AudioContext } from "../context/AudioContext";
import { PlayArrow, Pause } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import secondsToMMSS from "../utils/secondsToMMSS";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from "axios";
import TrackMenu from './trackMenu';

const Track = (props) => {
    const { song_id, song_name, song_author, song_image, song_duration } = props;
    const { handleToggleAudio, currentTrack, isPlaying } = useContext(AudioContext);
    const [isFavorite, setIsFavorite] = useState(false);
    const formattedDuration = secondsToMMSS(song_duration);
    const isCurrentTrack = currentTrack.song_id === song_id;
    const uid = localStorage.getItem('uid');

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
        checkIfFavorite();
    }, [uid, song_id]);

    const handleFavoriteClick = async () => {
        try {
            if (isFavorite) {
                await axios.post('http://localhost:8081/removeFromFavorites', { uid, song_id });
                setIsFavorite(false);
            } else {
                await axios.post('http://localhost:8081/addToFavorites', { uid, song_id });
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Error updating favorites:', error);
        }
    };


    return (
        <Stack sx={{ my: 0.5 }} direction="row" justifyContent="space-between" alignItems="center" width="500px" height="70px">
            <Stack>
                <IconButton onClick={() => handleToggleAudio(props)}>
                    {isCurrentTrack && isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
            </Stack>
            <Stack>
                <img width='70px' src={song_image} alt={song_name} />
            </Stack>
            <Stack width="150px">
                <p>{song_name}</p>
                <p>{song_author}</p>
            </Stack>
            <Stack>
                <p>{formattedDuration}</p>
            </Stack>
            <Stack>
                {isFavorite ? (
                    <IconButton onClick={handleFavoriteClick}>
                        <FavoriteIcon />
                    </IconButton>
                ) : (
                    <IconButton onClick={handleFavoriteClick}>
                        <FavoriteBorderIcon />
                    </IconButton>
                )}
            </Stack>
            <Stack>
                <TrackMenu />
            </Stack>
        </Stack>
    );
};

export default Track;
