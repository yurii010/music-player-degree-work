import { useContext, useState, useEffect } from "react";
import { AudioContext } from "../context/AudioContext";
import Track from "../track/track";
import axios from "axios";
import secondsToMMSS from '../utils/secondsToTime';

const DefaultPage = () => {
    const { activeDefPlaylist, defaultPlaylistSongs, setDefaultPlaylistSongs } = useContext(AudioContext);

    useEffect(() => {
        if (!activeDefPlaylist) return;
        const fetchSongs = async (def_playlist_id) => {
            try {
                const responseDefaultSongs = await axios.post('http://localhost:8081/defaultPlaylistSongs');
                const songs = responseDefaultSongs.data;
                const foundSongs = songs.filter(playlist => playlist.default_playlist_id === def_playlist_id);
                setDefaultPlaylistSongs(foundSongs);
            } catch (error) {
                console.error('Error fetching playlist songs:', error);
            }
        };
        fetchSongs(activeDefPlaylist.default_playlist_id);
    }, [activeDefPlaylist, setDefaultPlaylistSongs]);

    return (
        <div className="bg-[#212121] h-full p-2 text-white">
            <div className='bg-[#292929] rounded-2xl h-full p-2 flex flex-col'>
                <div className="flex flex-row border-b-2 border-white m-3">
                    <img src={activeDefPlaylist.photo} alt={activeDefPlaylist.name} className="w-36" />
                    <div className="flex flex-row items-center justify-center m-3 gap-4">
                        <p className="text-4xl">{activeDefPlaylist.name}</p>
                        <div>
                            <p>Кількість треків {activeDefPlaylist.song_count}</p>
                            <p>Час програвання {secondsToMMSS(activeDefPlaylist.duration)}</p>
                        </div>
                    </div>
                </div>
                <div className='my-3 overflow-auto'>
                    {defaultPlaylistSongs.map((track, index) => (
                        <Track key={index} {...track} playlistType="defaultPlaylist" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DefaultPage;
