import { useContext, useEffect, useState } from 'react';
import { AudioContext } from '../context/AudioContext';
import { PlayArrow, Pause, SkipPrevious, SkipNext, VolumeUp, VolumeDown, Repeat, RepeatOne, Shuffle } from "@mui/icons-material";
import ShuffleOnIcon from '@mui/icons-material/ShuffleOn';
import { IconButton, Slider } from '@mui/material';
import secondsToMMSS from '../utils/secondsToMMSS';

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
        <div className='flex flex-row items-center space-x-2'>
            <p className='pr-2'>{formattedDuration}</p>
            <Slider
                step={1}
                min={0}
                max={100}
                value={sliderCurrentTime}
                onChange={handleChangeCurrentTime}
                className='flex-grow'
            />
            <p className='pl-2'>{songDuration}</p>
        </div>
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
        <div className='flex flex-row items-center space-x-2 mr-2'>
            <VolumeDown />
            <Slider
                value={valueLoud}
                onChange={loudnessChange}
                className='w-64'
            />
            <VolumeUp />
        </div>
    );
};

const Playbar = () => {
    const { currentTrack, isPlaying, handleToggleAudio, findAuthorById, onChangeMenuItem, playNextSong, playPreviousSong, toggleShuffle, shuffle, repeatOne, toggleRepeatOne } = useContext(AudioContext);
    const { song_id, song_name, song_author, author_id, song_image } = currentTrack;
    const isCurrentTrack = currentTrack.song_id === song_id;

    const handleAuthorClick = (author_id) => {
        findAuthorById(author_id);
        onChangeMenuItem('author');
    };

    return (
        <div className='bg-[#212121] p-3 text-white'>
            <div className='w-full flex flex-row items-center justify-between bg-[#292929] rounded-2xl'>
                <div className='flex flex-row items-center space-x-4 p-2'>
                    <img src={song_image} alt={song_name} className='ml-2 w-16 h-16 object-cover' />
                    <div className='flex flex-col'>
                        <p className='whitespace-nowrap overflow-hidden overflow-ellipsis w-52'>{song_name}</p>
                        <p onClick={() => handleAuthorClick(author_id)} className='text-white hover:text-blue-600 cursor-pointer whitespace-nowrap overflow-hidden overflow-ellipsis w-32'>{song_author}</p>
                    </div>
                </div>
                <div className='flex flex-col items-center space-y-2 p-2'>
                    <div className='flex flex-row items-center space-x-2'>
                        <IconButton style={{ color: 'white' }} onClick={toggleShuffle} >
                            {shuffle ? <ShuffleOnIcon /> : <Shuffle />}
                        </IconButton>
                        <IconButton style={{ color: 'white' }} onClick={playPreviousSong}>
                            <SkipPrevious />
                        </IconButton>
                        <IconButton style={{ color: 'white' }} onClick={() => handleToggleAudio(currentTrack)}>
                            {isCurrentTrack && isPlaying ? <Pause /> : <PlayArrow />}
                        </IconButton>
                        <IconButton style={{ color: 'white' }} onClick={playNextSong}>
                            <SkipNext />
                        </IconButton>
                        <IconButton style={{ color: 'white' }} onClick={toggleRepeatOne}>
                            {repeatOne ? <RepeatOne /> : <Repeat />}
                        </IconButton>
                    </div>
                    <div className='w-96'>
                        <TimeControls />
                    </div>
                </div>
                <div className='w-40 p-2'>
                    <LoudControls />
                </div>
            </div>
        </div>
    );
}

export default Playbar;