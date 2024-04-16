import { useContext } from "react";
import { AudioContext } from "../context/AudioContext";
import { PlayArrow, Pause } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Stack from '@mui/material/Stack';
import secondsToMMSS from "../utils/secondsToMMSS";

const Track = (props) => {
    const { handleToggleAudio, currentTrack, isPlaying } = useContext(AudioContext);
    const { song_id, song_name, song_author, song_image, song_duration } = props;
    const isCurrentTrack = currentTrack && currentTrack.song_id === song_id;
    const formattedDuration = secondsToMMSS(song_duration);

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
        </Stack>
    );
};

export default Track;
