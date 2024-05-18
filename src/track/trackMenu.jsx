import React, { useRef } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Dropdown, Space } from 'antd';
import { useAuthContext } from '../firebase/authProvider';

const TrackMenu = () => {
    const { userPlaylists } = useAuthContext();
    const dropdownRef = useRef(null);

    const allPlaylists = () => {
        return userPlaylists.map(playlist => ({
            key: `playlist_${playlist.playlist_id}`,
            label: playlist.playlist_name,
        }));
    };

    const items = [
        {
            key: 'add',
            label: 'Додати до плейлиста',
            children: allPlaylists(),
        },
        // {
        //     key: 'delete',
        //     label: 'Видалити з плейлиста',
        // },
    ];

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
