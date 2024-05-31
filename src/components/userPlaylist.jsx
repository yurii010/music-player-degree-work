import React, { useContext, useEffect } from "react";
import { AudioContext } from "../context/AudioContext";
import axios from "axios";
import Track from "../track/track";
import secondsToMMSS from '../utils/secondsToTime';
import ModalEditPlaylist from '../components/modal';
import DeleteIcon from '@mui/icons-material/Delete';

const UserPlaylist = () => {
    const { activePlaylist, onChangeMenuItem, setOpenPlaylistEdit, playlistName, getPlaylistName, playlistCountAndDuration, setPlaylistCountAndDuration, songsPlaylist, setSongsPlaylist } = useContext(AudioContext);


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
        <div className="bg-[#212121] h-full p-2 text-white">
            <div className='bg-[#292929] rounded-2xl h-full p-2 flex flex-col'>
                <div className="flex flex-row border-b-2 border-white m-3">
                    <img src={activePlaylist.playlist_image} alt={activePlaylist.playlist_name} className="w-36" />
                    <div className="flex flex-row items-center justify-between m-3 gap-4">
                        <div onClick={() => setOpenPlaylistEdit(true)}>
                            <p className="text-4xl">{playlistName}</p>
                        </div>
                        {playlistCountAndDuration && (
                            <div>
                                <p>Кількість треків {playlistCountAndDuration.song_count}</p>
                                <p>Час програвання {secondsToMMSS(playlistCountAndDuration.playlist_duration)}</p>
                            </div>
                        )}
                        <div className="ml-auto">
                            <button onClick={deletePlaylist}><DeleteIcon /></button>
                        </div>
                    </div>
                </div>
                <div className='my-5 overflow-auto'>
                    {songsPlaylist.length === 0 ? (
                        <p className="ml-3 text-3xl text-[#757575]">Ви ще не добавили ніяких пісень :)</p>
                    ) : (
                        songsPlaylist.map((song) => (
                            <Track key={song.song_id} {...song} playlistType="userPlaylist" />
                        ))
                    )}
                </div>
            </div>
            <ModalEditPlaylist />
        </div>
    );
};

export default UserPlaylist;
