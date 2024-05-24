import { useContext, useState, Fragment, useEffect } from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import Stack from '@mui/joy/Stack';
import { AudioContext } from '../context/AudioContext';

const ModalEditPlaylist = () => {
    const { openPlaylistEdit, setOpenPlaylistEdit, activePlaylist, newName, playlistName } = useContext(AudioContext);
    const [inputValue, setInputValue] = useState('');
    const id = activePlaylist.playlist_id;

    useEffect(() => {
        setInputValue(playlistName);
    }, [playlistName]);

    const handleChange = (event) => {
        if (event.target.value.length <= 30) {
            setInputValue(event.target.value);
        }
    };

    // const [file, setFile] = useState();
    // const setNewPlaylistPhoto = () => {
    //     const formData = new FormData()
    //     formData.append("id", id);
    //     formData.append('file', file)
    //     axios.post('http://localhost:8081/updatePlaylistImage', formData);
    // }

    return (
        <Fragment>
            <Modal open={openPlaylistEdit} onClose={() => setOpenPlaylistEdit(false)}>
                <ModalDialog>
                    <DialogTitle>Введіть нову назву плейлиста</DialogTitle>
                    <form onSubmit={(event) => { event.preventDefault(); setOpenPlaylistEdit(false); newName(id, inputValue); }}>
                        <Stack spacing={2}>
                            <FormControl>
                                <Input inputprops={{ maxLength: 30 }} value={inputValue} onChange={handleChange} required />
                            </FormControl>
                            <Button type="submit">Змінити</Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </Fragment >
    );
}

export default ModalEditPlaylist;
