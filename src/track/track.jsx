import { useContext } from "react";
import { AudioContext } from "../context/AudioContext";
import { PlayArrow, Pause } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import secondsToMMSS from "../utils/secondsToMMSS";

const Track = (props) => {
    const { song_id, song_name, song_author, song_image, song_duration } = props;
    const { handleToggleAudio, currentTrack, isPlaying } = useContext(AudioContext);
    const isCurrentTrack = currentTrack.song_id === song_id;
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
