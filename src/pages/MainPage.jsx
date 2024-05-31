import User from '../components/user';
import Menu from "../components/menu";
import Search from '../components/search';
import TrackList from "../track/trackList";
import { Navigate } from "react-router-dom";
import Playbar from "../components/playbar";
import Favorite from '../components/favorite';
import AlbumPage from "../components/albumPage";
import AuthorPage from "../components/authorPage";
import UserPlaylist from '../components/userPlaylist';
import { AudioContext } from "../context/AudioContext";
import { useContext, useState, useEffect } from "react";
import { useAuthContext } from '../firebase/authProvider';
import DefaultPage from "../components/defaultPage";
import '../index.css';

const MainPage = () => {
    const { menuItem } = useContext(AudioContext);
    const [content, setContent] = useState('golovna')
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
                setContent(<UserPlaylist />);
                break;
            case 'album':
                setContent(<AlbumPage />);
                break;
            case 'author':
                setContent(<AuthorPage />);
                break;
            case 'def':
                setContent(<DefaultPage />);
                break;
            default:
                setContent(<TrackList />);
                break;
        }
    }, [menuItem])

    return (
        <div className="flex flex-row h-screen">
            <Menu />
            <div className="flex flex-col w-full">
                <div className="flex-1 overflow-auto">
                    {content}
                </div>
                <Playbar className="fixed bottom-0 left-0 w-full" />
            </div>
        </div>
    )
};

export default MainPage;
