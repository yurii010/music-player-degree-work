import { useContext } from "react";
import { AudioContext } from "../context/AudioContext";
import { Stack } from "@mui/material";
import "../css/main.css";
import Track from "./track";
import DefaultPlaylist from "./defaultPlaylist";

const TrackList = () => {
    const { songs, defaultPlaylists, onChangeMenuItem, onChangeDefPlaylist } = useContext(AudioContext);

    return (
        <Stack>
            <Stack alignItems="center" flexDirection={'row'} justifyContent={'center'} columnGap={'10px'}>
                {defaultPlaylists.map((playlist, index) => (
                    <div onClick={() => { onChangeMenuItem('def'); onChangeDefPlaylist(playlist); }} key={`${playlist.default_playlist_id}-${index}`}>
                        <DefaultPlaylist key={index} {...playlist} />
                    </div>
                ))}
            </Stack>
            <Stack sx={{ m: 5 }} alignItems="center" className="list">
                {songs.map((track, index) => (
                    <Track key={index} {...track} />
                ))}
            </Stack>
        </Stack>
    );
};

export default TrackList;
