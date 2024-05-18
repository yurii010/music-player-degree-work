import { Stack } from "@mui/material";
import User from '../components/user';
import Menu from "../components/menu";
import Search from '../components/search';
import TrackList from "../track/trackList";
import { Navigate } from "react-router-dom";
import Playbar from "../components/playbar";
import Favorite from '../components/favorite';
import { AudioContext } from "../context/AudioContext";
import { useContext, useState, useEffect } from "react";
import { useAuthContext } from '../firebase/authProvider';

const MainPage = () => {
    const { menuItem } = useContext(AudioContext);
    const [content, setContent] = useState(<TrackList />)

    const { profile } = useAuthContext();

    if (!profile) {
        return (
            <Navigate to="/" />
        );
    }

    useEffect(() => {
        switch (menuItem) {
            case 'profile':
                setContent(<User />);
                break;
            case 'favorite':
                setContent(<Favorite />);
                break;
            case 'golovna':
                setContent(<TrackList />);
                break;
            case 'search':
                setContent(<Search />);
                break;
            case 'userPlaylist':
                setContent(<Search />);
                break;
            default:
                setContent(<TrackList />);
                break;
        }
    }, [menuItem])

    return (
        <Stack display='flex' direction='row'>
            <Menu />
            <Stack>
                <Stack alignItems='center' justifyContent='center' marginLeft='200px' sx={{ width: '100vh' }}>
                    {content}
                </Stack>
                <Playbar />
            </Stack>
        </Stack>
    )
};

export default MainPage;
