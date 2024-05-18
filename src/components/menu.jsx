import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAuthContext } from '../firebase/authProvider';
import { useContext, useEffect } from "react";
import { AudioContext } from "../context/AudioContext";
import { Stack, Box } from "@mui/material";
import "../css/main.css";
import axios from 'axios';

const Menu = () => {
  const { onChangeMenuItem } = useContext(AudioContext);
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
    <Box width='200px' sx={{ height: '100vh' }} border="1px solid black">
      <Stack width='200px' height='150px' alignItems="center" justifyContent="center">
        <img onClick={() => onChangeMenuItem('profile')} className="avatar-img" width='170px' height='100px' src={userPhoto} />
      </Stack>
      <Stack>
        <p onClick={() => onChangeMenuItem('golovna')}>Golovna</p>
        <p onClick={() => onChangeMenuItem('search')}>Search</p>
        <FavoriteIcon onClick={() => onChangeMenuItem('favorite')} />
        <PlaylistAddIcon onClick={handleCreatePlaylist} />
        <Stack className='users-playlist'>
          {userPlaylists.map((playlist, index) => (
            <img key={index} width='50px' src={playlist.playlist_image} onClick={() => onChangeMenuItem('userPlaylist')} />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default Menu;
