import { useContext, useState } from 'react';
import { AudioContext } from '../context/AudioContext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import Slider from '@mui/material/Slider';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import Stack from '@mui/material/Stack';
import seccondsToMMSS from '../utils/secondsToMMSS';
import '../css/playbar.css';

const Playbar = () => {

    const { songsAndAuthors, currentTrack, isPlaying, handleToggleAudio } = useContext(AudioContext);
    const { song_id, song_name, song_author, song_image, song_duration } = currentTrack || {};
    const [valueSong, setValueSong] = useState(0);
    const [valueLoud, setValueLoud] = useState(50);

    const songChange = (event, newValue) => {
        setValueSong(newValue);
    };
    const loudnessChange = (event, newValue) => {
        setValueLoud(newValue);
    };

    return (
        <div className='playbar-div'>
            <Stack spacing={2} direction="row" alignItems="center" justifyContent="center">
                <img width='70px' src={song_image} alt={song_name} />
                <div>
                    <p>{song_name}</p>
                    <p>{song_author}</p>
                </div>
            </Stack>
            <Stack spacing={1} direction="column" justifyContent="center" alignItems="center">
                <Stack spacing={2} direction="row" justifyContent="center" alignItems="center" width="500px">
                    <ShuffleIcon className='shuffleIcon' />
                    <SkipPreviousIcon className='skipPreviousIcon' />
                    <PlayArrowIcon className='playArrow' />
                    <SkipNextIcon className='skipNextIcon' />
                    <RepeatIcon className='repeatIcon' />
                    <RepeatOneIcon className='repeatOneIcon' sx={{ display: 'none' }} />
                </Stack>
                <Slider aria-label="Song" value={valueSong} onChange={songChange} />
            </Stack>
            <Stack spacing={2} direction="row" justifyContent="center" alignItems="center" width="200px">
                <VolumeDownIcon />
                <Slider className='loudness-slider' aria-label="Volume" value={valueLoud} onChange={loudnessChange} />
                <VolumeUpIcon />
            </Stack>
        </div >
    );
}

export default Playbar;