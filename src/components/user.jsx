import { Stack } from "@mui/material";
import "../css/main.css";
import { useAuthContext } from '../firebase/authProvider';
import { useState } from "react";
import axios from "axios";

const User = () => {
    const { profile, logout } = useAuthContext();
    const [file, setFile] = useState()
    const uid = localStorage.getItem('uid');

    const upload = () => {
        const formData = new FormData()
        formData.append("uid", uid);
        formData.append('file', file)
        axios.post('http://localhost:8081/upload', formData).catch(er => console.log(er))
    }
    
    const deleteAvatar = () => {
        axios.post('http://localhost:8081/deleteAvatar', { uid }).catch(er => console.log(er));
    }    

    return (
        <Stack>
            {profile.username}
            <div className="div-input">
                <input type="file" accept="image/jpeg, image/png" onChange={(e) => setFile(e.target.files[0])} />
                <button onClick={upload}>Зберегти в базі</button><br /><br />
                <button onClick={deleteAvatar}>Видалити фото</button>
            </div>

            <button onClick={logout}>logout</button>
        </Stack>
    );
};

export default User;
