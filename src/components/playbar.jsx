import { useContext, useEffect, useState } from 'react';
import { AudioContext } from '../context/AudioContext';
import { PlayArrow, Pause, SkipPrevious, SkipNext, VolumeUp, VolumeDown, Repeat, RepeatOne, Shuffle } from "@mui/icons-material";
import { Stack, IconButton, Slider } from '@mui/material';
import secondsToMMSS from '../utils/secondsToMMSS';
import '../css/playbar.css';

const TimeControls = () => {
    const { audio, currentTrack } = useContext(AudioContext);
    const { song_duration } = currentTrack;
    const [currentTime, setCurrentTime] = useState(0);
    const formattedDuration = secondsToMMSS(currentTime);
    const sliderCurrentTime = Math.round((currentTime / song_duration) * 100);
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

    const { currentTrack, isPlaying, handleToggleAudio } = useContext(AudioContext);
    const { song_id, song_name, song_author, song_image, song_duration } = currentTrack;
    const isCurrentTrack = currentTrack.song_id === song_id;
    const formattedDuration = secondsToMMSS(song_duration);

    return (
        <div className='playbar-div'>
            <Stack sx={{ m: 2 }} spacing={2} direction="row" alignItems="center" justifyContent="center">
                <img width='70px' src={song_image} alt={song_name} />
                <div>
                    <p>{song_name}</p>
                    <p>{song_author}</p>
                </div>
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
                    <TimeControls />
                    <p>{formattedDuration}</p>
                </Stack>
            </Stack>
            <Stack sx={{ m: 2 }} spacing={2} direction="row" justifyContent="center" alignItems="center" width="200px">
                <LoudControls />
            </Stack>
        </div>
    );
}

export default Playbar;