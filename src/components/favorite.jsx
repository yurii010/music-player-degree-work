import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { AudioContext } from "../context/AudioContext";
import Track from "../track/track";
import secondsToMMSS from '../utils/secondsToTime';

const Favorite = () => {
    const { favoriteSongs, setFavoriteSongs } = useContext(AudioContext);
    const uid = localStorage.getItem('uid');
    // const [favorite, setFavorite] = useState();
    useEffect(() => {
        const fetchFavoriteSongs = async () => {
            try {
                const response = await axios.post('http://localhost:8081/userFavoriteSongs', { uid });
                setFavoriteSongs(response.data);
                // const favresponse = await axios.post('http://localhost:8081/favoriteInfo', { uid });
                // setFavorite(favresponse.data);
            } catch (error) {
                console.error('Error fetching favorite songs:', error);
            }
        };
        fetchFavoriteSongs();
    }, []);

    const removeFromFavorites = (songId) => {
        setFavoriteSongs(favoriteSongs.filter(song => song.song_id !== songId));
    };

    return (
        <div className="bg-[#212121] h-full p-2 text-white">
            <div className='bg-[#292929] rounded-2xl h-full p-2 flex flex-col'>
                <div className="flex flex-row border-b-2 border-white m-3">
                    <p className="text-3xl m-3">Ваш улюблений список треків</p>
                    {/* <div>
                        <p>Кількість треків {favorite.song_count}</p>
                        <p>Час програвання {secondsToMMSS(favorite.favorite_list_duration)}</p>
                    </div> */}
                </div>
                <div className='my-3 overflow-auto'>
                    {
                        favoriteSongs.length === 0 ? (
                            <p className="ml-3 text-3xl text-[#757575]">Ви ще не добавили ніяких пісень :)</p>
                        ) : (
                            favoriteSongs.map((track, index) => (
                                <Track key={index} {...track} playlistType="favoriteList" removeFromFavorites={removeFromFavorites} />
                            ))
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Favorite;
