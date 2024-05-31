import { useAuthContext } from '../firebase/authProvider';
import { useState } from "react";
import axios from "axios";
import CreateIcon from '@mui/icons-material/Create';

const User = () => {
    const { profile, logout, userPhoto } = useAuthContext();
    const [file, setFile] = useState();
    const [hovered, setHovered] = useState(false);

    const uid = localStorage.getItem('uid');

    const upload = () => {
        if (file) {
            const formData = new FormData();
            formData.append("uid", uid);
            formData.append('file', file);
            axios.post('http://localhost:8081/upload', formData)
                .catch(er => console.log(er));
        } else {
            return;
        }
    }

    const deleteAvatar = () => {
        axios.post('http://localhost:8081/deleteAvatar', { uid }).catch(er => console.log(er));
    }

    const handleImageClick = () => {
        document.getElementById('fileInput').click();
    }

    return (
        <div className='bg-[#212121] h-full p-2 text-white'>
            <div className='bg-[#292929] rounded-2xl h-full p-2'>
                <div className='m-3'>
                    <p className='text-3xl'>Змінити фото профілю</p>
                    <img className='w-52 my-3 cursor-pointer' src={userPhoto} onClick={handleImageClick} />
                    <input 
                        type="file" 
                        accept="image/jpeg, image/png" 
                        id="fileInput" 
                        className="hidden" 
                        onChange={(e) => setFile(e.target.files[0])} 
                    />
                    <div className='flex flex-col items-start mt-3 space-y-2'>
                        <button className='bg-blue-500 text-white py-2 px-4 rounded' onClick={upload}>Зберегти в базі</button>
                        <button className='bg-red-500 text-white py-2 px-4 rounded' onClick={deleteAvatar}>Видалити фото</button>
                    </div>
                    <p className='mt-3'>Ваш нікнейм: {profile.username}</p>
                    <button className='bg-gray-500 text-white py-2 px-4 rounded mt-3' onClick={logout}>Вийти з профілю</button>
                </div>
            </div>
        </div>
    );
};

export default User;
