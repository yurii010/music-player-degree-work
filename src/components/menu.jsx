import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import SearchIcon from '@mui/icons-material/Search';
import HouseIcon from '@mui/icons-material/House';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAuthContext } from '../firebase/authProvider';
import { useContext, useEffect } from "react";
import { AudioContext } from "../context/AudioContext";
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
    <div className='flex flex-col h-screen w-60 bg-[#212121] text-white'>
      <div className='h-32 w-auto bg-[#292929] rounded-2xl flex items-center justify-center m-2 p-2'>
        <img onClick={() => onChangeMenuItem('profile')} src={userPhoto} className='m-auto max-h-full max-w-full object-contain' />
      </div>
      <div className='h-full w-auto bg-[#292929] rounded-2xl flex flex-col m-2 p-2 gap-y-1'>
        <p onClick={() => onChangeMenuItem('golovna')}>Головна сторінка<HouseIcon /></p>
        <p onClick={() => onChangeMenuItem('search')}>Пошук<SearchIcon /></p>
        <div onClick={() => onChangeMenuItem('favorite')}>
          <p>Улюблений список <FavoriteIcon /></p>
        </div>
        <div onClick={handleCreatePlaylist}>
          <p>Створити плейлист <PlaylistAddIcon /></p>
        </div>
        <div className='h-72 overflow-auto'>
          {userPlaylists.map((playlist) => (
            <div className='flex flex-row items-center space-x-2' key={playlist.playlist_id}>
              <div className='flex-shrink-0'>
                <img src={playlist.playlist_image} onClick={() => { onChangeMenuItem('userPlaylist'); onChangePlaylist(playlist); }} className='w-12 h-12' />
              </div>
              <p onClick={() => { onChangeMenuItem('userPlaylist'); onChangePlaylist(playlist); }} className='break-words whitespace-normal'>
                {playlist.playlist_name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div >
  );
};

export default Menu;
