import { useContext } from "react";
import { AudioContext } from "../context/AudioContext";
import "../css/main.css";
import Track from "./track";
import DefaultPlaylist from "./defaultPlaylist";

const TrackList = () => {
    const { songs, defaultPlaylists, onChangeMenuItem, onChangeDefPlaylist } = useContext(AudioContext);

    return (
        <div className='bg-[#212121] h-full p-2 text-white'>
            <div className='bg-[#292929] rounded-2xl h-full p-3 flex flex-col'>
                <div className="flex flex-row m-3">
                    {defaultPlaylists.map((playlist, index) => (
                        <div onClick={() => { onChangeMenuItem('def'); onChangeDefPlaylist(playlist); }} key={`${playlist.default_playlist_id}-${index}`}>
                            <DefaultPlaylist key={index} {...playlist} />
                        </div>
                    ))}
                </div>
                <p className="text-4xl m-3 -mt-1">Хіти</p>
                <div className="overflow-auto border-t-2 border-white">
                    {songs.map((track, index) => (
                        <Track key={index} {...track} playlistType="standartList" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrackList;
