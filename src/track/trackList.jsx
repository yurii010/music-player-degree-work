import { useContext } from "react";
import { AudioContext } from "../context/AudioContext";
import Track from "./track";
import { Stack } from "@mui/material";
import "../css/main.css";

const TrackList = () => {
    const { songs } = useContext(AudioContext);

    return (
        <Stack sx={{ m: 5 }} alignItems="center" className="list">
            {songs.map((track, index) => (
                <Track key={index} {...track} />
            ))}
        </Stack>
    );
};

export default TrackList;
