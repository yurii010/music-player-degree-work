import React, { useContext } from 'react';
import { AudioContext } from '../context/AudioContext';
import '../css/songslist.css';

const SongsList = () => {
    const { songsAndAuthors, currentTrack, isPlaying, handleToggleAudio } = useContext(AudioContext);



    return (
        <div>
            <ul>
                {songsAndAuthors.map((song, index) => (
                    <li className='songs-list' key={index}>
                        <div className='songs-list-div'>
                            <div className='song-info'>
                                <img src={song.song_image} alt={song.song_name} />
                                <div className='song-text'>
                                    <p className='song-name'>{song.song_name}</p>
                                    <p className='song-author'>{song.song_author}</p>
                                </div>
                            </div>
                            <button onClick={() => playSong(song)}>
                                {currentSong === song && isPlaying ? "Pause" : "Play"}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SongsList;
