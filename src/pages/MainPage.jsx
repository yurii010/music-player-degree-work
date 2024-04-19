import { useContext } from "react";
import { AudioContext } from "../context/AudioContext";
import Track from "../track/track";
import { Stack } from "@mui/material";
import "../css/main.css";

const MainPage = () => {
    const { songs } = useContext(AudioContext);

    return (
        <Stack sx={{ m: 5 }} alignItems="center" className="list">
            {songs.map((track) => (
                <Track key={track.id} {...track} />
            ))}
        </Stack>
    );
};

export default MainPage;
