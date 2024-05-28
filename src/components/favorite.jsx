import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { AudioContext } from "../context/AudioContext";
import { Stack } from "@mui/material";
import Track from "../track/track";

const Favorite = () => {
    const { favoriteSongs, setFavoriteSongs } = useContext(AudioContext);
    const uid = localStorage.getItem('uid');

    useEffect(() => {
        const fetchFavoriteSongs = async () => {
            try {
                const response = await axios.post('http://localhost:8081/userFavoriteSongs', { uid });
                setFavoriteSongs(response.data);
            } catch (error) {
                console.error('Error fetching favorite songs:', error);
            }
        };
        fetchFavoriteSongs();
    }, []);

    return (
        <Stack sx={{ m: 5 }} alignItems="center" className="list">
            {favoriteSongs.map((track, index) => (
                <Track key={index} {...track} playlistType="favoriteList"/>
            ))}
        </Stack>
    );
};

export default Favorite;
