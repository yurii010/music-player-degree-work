import { useContext, useEffect, useState } from 'react';
import { AudioContext } from '../context/AudioContext';
import { PlayArrow, Pause, SkipPrevious, SkipNext, VolumeUp, VolumeDown, Repeat, RepeatOne, Shuffle } from "@mui/icons-material";
import { Stack, IconButton, Slider, Box } from '@mui/material';
import secondsToMMSS from '../utils/secondsToMMSS';
import '../css/playbar.css';

const TimeControls = () => {
    const { audio, currentTrack } = useContext(AudioContext);
    const { song_duration } = currentTrack;
    const [currentTime, setCurrentTime] = useState(0);
    const formattedDuration = secondsToMMSS(currentTime);
    const sliderCurrentTime = song_duration ? Math.round((currentTime / song_duration) * 100) : 0;
    const songDuration = secondsToMMSS(song_duration);

    const handleChangeCurrentTime = (_, value) => {
        const time = Math.round((value / 100) * song_duration);
        setCurrentTime(time);
        audio.currentTime = time;
    };

    useEffect(() => {
        const timeInterval = setInterval(() => {
            setCurrentTime(audio.currentTime);
        }, 1000);

        return () => {
            clearInterval(timeInterval);
        };
    }, []);

    return (
        <>
            <p>{formattedDuration}</p>
            <Slider
                step={1}
                min={0}
                max={100}
                value={sliderCurrentTime}
                onChange={handleChangeCurrentTime}
            />
            <p>{songDuration}</p>
        </>
    );
};

const LoudControls = () => {
    const { audio } = useContext(AudioContext);
    const [valueLoud, setValueLoud] = useState(25);
    const loudnessChange = (event, newValue) => {
        setValueLoud(newValue);
    };

    useEffect(() => {
        audio.volume = valueLoud / 1000;
    });

    return (
        <>
            <VolumeDown />
            <Slider
                value={valueLoud}
                onChange={loudnessChange}
            />
            <VolumeUp />
        </>
    );
};

const Playbar = () => {
    const { currentTrack, isPlaying, handleToggleAudio, findAuthorById, onChangeMenuItem } = useContext(AudioContext);
    const { song_id, song_name, song_author, author_id, song_image } = currentTrack;
    const isCurrentTrack = currentTrack.song_id === song_id;

    const handleAuthorClick = (author_id) => {
        findAuthorById(author_id);
        onChangeMenuItem('author');
    };

    return (
        <Box sx={{ position: 'fixed', bottom: 0, width: '100vh', justifyContent: 'center', marginLeft: '15%' }} className='playbar-div'>
            <Stack sx={{ m: 2, marginLeft: '0' }} spacing={2} direction="row" alignItems="center" justifyContent="center" width='200px' height='70px'>
                <img width='70px' src={song_image} alt={song_name} />
                <Box sx={{ minWidth: '100px' }}>
                    <p>{song_name}</p>
                    <p style={{ cursor: 'pointer', color: 'blue' }} onClick={() => handleAuthorClick(author_id)}>{song_author}</p>
                </Box>
            </Stack>
            <Stack spacing={1} direction="column" justifyContent="center" alignItems="center">
                <Stack spacing={2} direction="row" justifyContent="center" alignItems="center" width="500px">
                    <Shuffle className='shuffleIcon' />
                    <SkipPrevious />
                    <IconButton onClick={() => handleToggleAudio(currentTrack)}>
                        {isCurrentTrack && isPlaying ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    <SkipNext className='skipNextIcon' />
                    <Repeat className='repeatIcon' />
                    <RepeatOne className='repeatOneIcon' sx={{ display: 'none' }} />
                </Stack>
                <Stack sx={{ m: 2 }} spacing={2} direction="row" justifyContent="center" alignItems="center" width="700px">
                    <TimeControls sx={{ minWidth: '300px' }} />
                </Stack>
            </Stack>
            <Stack sx={{ m: 2, minWidth: '200px' }} spacing={2} direction="row" justifyContent="center" alignItems="center" width="200px">
                <LoudControls />
            </Stack>
        </Box>
    );
}

export default Playbar;