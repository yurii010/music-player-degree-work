import React, { useContext, useEffect, useState } from 'react';
import { AudioContext } from "../context/AudioContext";
import { Input, Space, Radio } from 'antd';
import { Stack } from "@mui/material";
import Track from '../track/track';
import Albums from '../track/albums';
import Authors from '../track/authors';
import "../css/main.css";

const Search = () => {
    const { authors, albums, songs, onChangeAlbum, onChangeAuthor, onChangeMenuItem } = useContext(AudioContext);
    const [value, setValue] = useState('songs');
    const [query, setQuery] = useState('');
    const [outputValue, setOutputValue] = useState(songs);
    const { Search } = Input;

    useEffect(() => {
        const filteredQuery = runSearch(query);
        setOutputValue(filteredQuery);
    }, [value, query, authors, albums, songs]);

    const getFindingValue = () => {
        switch (value) {
            case 'albums':
                return albums;
            case 'authors':
                return authors;
            case 'songs':
            default:
                return songs;
        }
    };

    const runSearch = (query) => {
        if (!query) {
            return getFindingValue();
        }
        const lowerCaseQuery = query.toLowerCase();
        switch (value) {
            case 'songs':
                return songs.filter((track) => track.song_name.toLowerCase().includes(lowerCaseQuery));
            case 'authors':
                return authors.filter((author) => author.author_name.toLowerCase().includes(lowerCaseQuery));
            case 'albums':
                return albums.filter((album) => album.album_name.toLowerCase().includes(lowerCaseQuery));
            default:
                return [];
        }
    }

    const renderResults = () => {
        switch (value) {
            case 'albums':
                return outputValue.map((album, index) => (
                    <div onClick={() => { onChangeMenuItem('album'); onChangeAlbum(album); }} key={`${album.album_id}-${index}`}>
                        <Albums {...album} />
                    </div>
                ));
            case 'authors':
                return outputValue.map((author, index) => (
                    <div onClick={() => { onChangeMenuItem('author'); onChangeAuthor(author); }} key={`${author.author_id}-${index}`}>
                        <Authors {...author} />
                    </div>
                ));
            case 'songs':
            default:
                return outputValue.map((track, index) => (
                    <div key={`${track.song_id}-${index}`} >
                        <Track {...track} />
                    </div>
                ));
        }
    };

    const handleRadioChange = (e) => {
        setValue(e.target.value);
    };

    const handleChange = (event) => {
        setQuery(event.target.value);
    }

    return (
        <Stack>
            <Search placeholder="Пошук" onChange={handleChange} enterButton />
            <Radio.Group style={{ marginBottom: 16 }} value={value} onChange={handleRadioChange}>
                <Radio.Button value="songs">Пісні</Radio.Button>
                <Radio.Button value="authors">Автори</Radio.Button>
                <Radio.Button value="albums">Альбоми</Radio.Button>
            </Radio.Group>
            <Stack sx={{ m: 5 }} alignItems="center" className="list">
                {renderResults()}
            </Stack>
        </Stack>
    );
};

export default Search;
