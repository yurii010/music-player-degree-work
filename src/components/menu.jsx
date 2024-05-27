import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAuthContext } from '../firebase/authProvider';
import { useContext, useEffect } from "react";
import { AudioContext } from "../context/AudioContext";
import { Stack, Box } from "@mui/material";
import "../css/main.css";
import axios from 'axios';

const Menu = () => {
  const { onChangeMenuItem, onChangePlaylist } = useContext(AudioContext);
  const { userPhoto, loadUserAvatar, userPlaylists, getPlaylists } = useAuthContext();
  const uid = localStorage.getItem('uid');

  useEffect(() => {
    if (uid) {
      loadUserAvatar(uid);
      getPlaylists(uid);
    }
  }, [uid, loadUserAvatar, getPlaylists]);

  const handleCreatePlaylist = async () => {
    try {
      await axios.post('http://localhost:8081/createPlaylist', { uid });
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  return (
    <Box width='200px' sx={{ height: '100vh' }} bgcolor={'#202020'} alignItems="center" justifyContent='center'>
      <Stack alignItems="center" justifyContent="center" width='185px' height='165px' bgcolor='#292929' m={1} borderRadius={5}>
        <img onClick={() => onChangeMenuItem('profile')} className="avatar-img" width='175px' height='100px' src={userPhoto} />
      </Stack>
      <Stack bgcolor='#292929' m={1} borderRadius={5} height='75%' padding={2} rowGap={1}>
        <p onClick={() => onChangeMenuItem('golovna')}>Головна сторінка</p>
        <p onClick={() => onChangeMenuItem('search')}>Пошук</p>
        <Stack direction="row" alignItems="center" spacing={1} onClick={() => onChangeMenuItem('favorite')}>
          <p>Любимий список <FavoriteIcon /></p>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1} onClick={handleCreatePlaylist}>
          <p>Створити плейлист <PlaylistAddIcon /></p>
        </Stack>
        <Stack className='users-playlist'>
          {userPlaylists.map((playlist) => (
            <Stack className='menu-playlist-item' direction={'row'} key={playlist.playlist_id} columnGap={1}>
              <Stack bgcolor='white' padding={0.5} borderRadius={2}>
                <img width='35px' src={playlist.playlist_image} onClick={() => { onChangeMenuItem('userPlaylist'); onChangePlaylist(playlist); }} />
              </Stack>
              <p onClick={() => { onChangeMenuItem('userPlaylist'); onChangePlaylist(playlist); }}
                style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>{playlist.playlist_name}</p>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default Menu;
