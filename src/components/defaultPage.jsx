import { useContext, useState, useEffect } from "react";
import { AudioContext } from "../context/AudioContext";
import Track from "../track/track";
import axios from "axios";
import secondsToMMSS from "../utils/secondsToMMSS";

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
        <div>
            <div>
                <img src={activeDefPlaylist.photo} alt={activeDefPlaylist.name} width="50" />
                <span>{activeDefPlaylist.name}</span>
            </div>
            <div>
                <span>Кількість пісень: {activeDefPlaylist.song_count}</span><br />
                <span>Тривалість: {secondsToMMSS(activeDefPlaylist.duration)} seconds</span>
            </div>
            <div className="list">
                {defaultPlaylistSongs.map((track, index) => (
                    <Track key={index} {...track} playlistType="defaultPlaylist"/>
                ))}
            </div>
        </div>
    );
};

export default DefaultPage;
