import React, { useEffect, useRef, useState, useContext } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Dropdown, Space } from 'antd';
import { useAuthContext } from '../firebase/authProvider';
import axios from 'axios';
import { AudioContext } from '../context/AudioContext';

const TrackMenu = ({ songId, albumId }) => {
    const { userPlaylists } = useAuthContext();
    const { activePlaylist, menuItem, removeSongFromPlaylist, setSongsPlaylist, setPlaylistCountAndDuration, findAlbumById, onChangeMenuItem } = useContext(AudioContext);
    const [ifPlaylist, setIfPlaylist] = useState(true);
    const dropdownRef = useRef(null);

    const allPlaylists = () => {
        return userPlaylists.map(playlist => ({
            key: `playlist_${playlist.playlist_id}`,
            label: playlist.playlist_name,
            onClick: () => addSongToPlaylist(playlist.playlist_id),
        }));
    };

    const addSongToPlaylist = async (playlistId) => {
        try {
            const data = { playlist_id: playlistId, song_id: songId };
            const response = await axios.post('http://localhost:8081/addSongToPlaylist', data);
            if (response) {
                alert(response.data.message)
            }
            const songs = await axios.post('http://localhost:8081/getPlaylistSongs', { playlist_id: activePlaylist.playlist_id });
            setSongsPlaylist(songs.data);
        } catch (error) {
            console.error('Error adding song to playlist:', error);
        }
    };

    const deleteFromPlaylist = async () => {
        try {
            if (!ifPlaylist) {
                const data = { playlist_id: activePlaylist.playlist_id, song_id: songId };
                await axios.post('http://localhost:8081/removeSongFromPlaylist', data);
                removeSongFromPlaylist(songId);
                const response = await axios.post('http://localhost:8081/getPlaylist', { playlist_id: activePlaylist.playlist_id });
                setPlaylistCountAndDuration(response.data)
            }
        } catch (error) {
            console.error('Error removing song from playlist:', error);
        }
    };

    const handleAlbumClick = (album_id) => {
        findAlbumById(album_id);
        onChangeMenuItem('album');
    };

    const items = [
        { key: 'album', label: (<div onClick={() => handleAlbumClick(albumId)}>Перейти до альбому</div>), },
        { key: 'add', label: 'Додати до плейлиста', children: allPlaylists() },
        { key: 'delete', label: (<div onClick={deleteFromPlaylist}>Видалити з плейлиста</div>), disabled: ifPlaylist, },
    ];

    useEffect(() => {
        if (menuItem === 'userPlaylist') {
            setIfPlaylist(false);
        } else {
            setIfPlaylist(true);
        }
    }, [menuItem]);

    return (
        <div ref={dropdownRef}>
            <Dropdown getPopupContainer={() => dropdownRef.current} menu={{ items }}>
                <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        <MoreVertIcon />
                    </Space>
                </a>
            </Dropdown>
        </div>
    );
};

export default TrackMenu;
