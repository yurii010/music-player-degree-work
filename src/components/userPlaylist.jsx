import { Stack } from "@mui/material";
import "../css/main.css";
import React, { useContext, useEffect, useState } from "react";
import { AudioContext } from "../context/AudioContext";
import axios from "axios";
import Track from "../track/track";
import secondsToMMSS from '../utils/secondsToMMSS';
import ModalEditPlaylist from '../components/modal';

const UserPlaylist = () => {
    const { activePlaylist, onChangeMenuItem, setOpenPlaylistEdit, playlistName, getPlaylistName, playlistCountAndDuration, setPlaylistCountAndDuration } = useContext(AudioContext);
    const [songsPlaylist, setSongsPlaylist] = useState([]);


    useEffect(() => {
        if (!activePlaylist) return;
        const fetchSongs = async () => {
            try {
                const response = await axios.post('http://localhost:8081/getPlaylistSongs', { playlist_id: activePlaylist.playlist_id });
                setSongsPlaylist(response.data);
            } catch (error) {
                console.error('Error fetching playlist songs:', error);
            }
        };
        getPlaylistName(activePlaylist.playlist_id);
        fetchSongs();
    }, [activePlaylist, setSongsPlaylist, getPlaylistName]);

    useEffect(() => {
        setPlaylistCountAndDuration({
            song_count: activePlaylist.song_count,
            playlist_duration: activePlaylist.playlist_duration
        });
    }, [activePlaylist, setPlaylistCountAndDuration])

    const deletePlaylist = () => {
        onChangeMenuItem('golovna');
        axios.post('http://localhost:8081/deletePlaylist', { playlistid: activePlaylist.playlist_id });
    }

    if (!activePlaylist) {
        return <div>Loading...</div>;
    }

    return (
        <Stack className="list" direction="column" width="100%" sx={{ mt: 2 }}>
            <Stack direction='row' justifyContent='' width='100%' sx={{ mb: 2 }}>
                <Stack>
                    <img width='80px' src={activePlaylist.playlist_image} alt={activePlaylist.playlist_name} />
                </Stack>
                <Stack>
                    <Stack sx={{ mb: 3 }} onClick={() => setOpenPlaylistEdit(true)}>
                        <h1>{playlistName}</h1>
                    </Stack>
                    <Stack>
                        {playlistCountAndDuration && (
                            <>
                                <p>Кількість пісень: {playlistCountAndDuration.song_count}</p>
                                <p>Час програвання плейлиста: {secondsToMMSS(playlistCountAndDuration.playlist_duration)}</p>
                            </>
                        )}
                    </Stack>
                </Stack>
                <button onClick={deletePlaylist}>Видалити плейлист</button>
            </Stack>
            <Stack direction="column" spacing={2}>
                {songsPlaylist.map((song) => (
                    <Track key={song.song_id} {...song} playlistType="userPlaylist" listId={activePlaylist.playlist_id} />
                ))}
            </Stack>
            <ModalEditPlaylist />
        </Stack>
    );
};

export default UserPlaylist;
