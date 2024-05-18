import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

const app = express();
app.use(express.json());
app.use(cors())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'music_player'
})

app.get('/', (req, res) => {
    return res.json('from backend side');
})

app.get('/songsAndAuthors', (req, res) => {
    const sql = 'SELECT songs.*, authors.author_name AS song_author FROM songs LEFT JOIN authors ON songs.author_id = authors.author_id';
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./public/images")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        return cb(null, `${uniqueSuffix}_${file.originalname}`)
    }
})

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG and PNG files are allowed!'), false);
        }
    }
})

app.post('/upload', upload.single('file'), (req, res) => {
    const uid = req.body.uid;
    const newPhoto = req.file.filename;
    const sqlSelect = 'SELECT uphoto FROM users WHERE uid = ?';
    const sqlUpdate = 'UPDATE users SET uphoto = ? WHERE uid = ?';

    db.query(sqlSelect, uid, (err, result) => {
        if (err) return res.json({ Error: "err" });
        const currentPhoto = result[0].uphoto;
        if (currentPhoto) {
            fs.unlink(`./public/images/${currentPhoto}`, (err) => {
                if (err) return res.json({ Error: "err delete" });
            });
        }
        db.query(sqlUpdate, [newPhoto, uid], (err, result) => {
            if (err) return res.json({ Error: "err update" });
            return res.json({ Status: "Success" });
        });
    });
});

app.post('/loadAvatar', async (req, res) => {
    const uid = req.body.uid;
    const sql = 'SELECT uphoto FROM users WHERE uid = ?';
    db.query(sql, uid, (err, data) => {
        if (err) return res.json({ error: err.message });
        return res.json({ uphoto: data[0].uphoto });
    });
});

app.post('/deleteAvatar', async (req, res) => {
    const uid = req.body.uid;
    const sqlSelect = 'SELECT uphoto FROM users WHERE uid = ?';
    const sqlDeletePhoto = 'UPDATE users SET uphoto = "" WHERE uid = ?';

    db.query(sqlSelect, uid, (err, data) => {
        if (err) return res.json({ error: err.message });
        const currentPhoto = data[0]?.uphoto;
        if (currentPhoto) {
            fs.unlink(`./public/images/${currentPhoto}`, (err) => {
                if (err) return res.json({ error: "Error deleting photo from storage" });
                db.query(sqlDeletePhoto, uid, (err, result) => {
                    if (err) return res.json({ error: "Error updating database" });
                    return res.json({ Status: "Photo deleted successfully" });
                });
            });
        } else {
            return res.json({ Status: "No photo to delete" });
        }
    });
});

app.post('/userFavoriteSongs', (req, res) => {
    const uid = req.body.uid;
    const sql = `SELECT songs.*, authors.author_name AS song_author FROM songs LEFT JOIN favorite_lists_items ON songs.song_id = favorite_lists_items.song_id LEFT JOIN favorite_lists ON favorite_lists.favorite_list_id = favorite_lists_items.favorite_list_id LEFT JOIN authors ON songs.author_id = authors.author_id WHERE favorite_lists.uid = ?`;
    db.query(sql, [uid], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post('/addToFavorites', (req, res) => {
    const { uid, song_id } = req.body;
    const checkIfExistsQuery = 'SELECT * FROM favorite_lists_items WHERE favorite_list_id IN (SELECT favorite_list_id FROM favorite_lists WHERE uid = ?) AND song_id = ?';
    db.query(checkIfExistsQuery, [uid, song_id], (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result.length > 0) return res.json({ message: 'Song already exists in favorites' });
        const insertQuery = 'INSERT INTO favorite_lists_items (favorite_list_id, song_id) VALUES ((SELECT favorite_list_id FROM favorite_lists WHERE uid = ?), ?)';
        db.query(insertQuery, [uid, song_id], (err, result) => {
            if (err) return res.json({ error: err.message });
            const updateFavoriteListQuery = `UPDATE favorite_lists SET song_count = song_count + 1,favorite_list_duration = favorite_list_duration + (SELECT song_duration FROM songs WHERE song_id = ?) WHERE uid = ?`;
            db.query(updateFavoriteListQuery, [song_id, uid], (err, result) => {
                if (err) return res.json({ error: err.message });
                return res.json({ message: 'Song added to favorites successfully' });
            });
        });
    });
});

app.post('/removeFromFavorites', (req, res) => {
    const { uid, song_id } = req.body;
    const checkIfExistsQuery = 'SELECT * FROM favorite_lists_items WHERE favorite_list_id IN (SELECT favorite_list_id FROM favorite_lists WHERE uid = ?) AND song_id = ?';
    db.query(checkIfExistsQuery, [uid, song_id], (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result.length === 0) return res.json({ message: 'Song not found in favorites' });
        const removeFromFavoritesQuery = 'DELETE FROM favorite_lists_items WHERE favorite_list_id IN (SELECT favorite_list_id FROM favorite_lists WHERE uid = ?) AND song_id = ?';
        db.query(removeFromFavoritesQuery, [uid, song_id], (err, result) => {
            if (err) return res.json({ error: err.message });
            const updateFavoriteListQuery = `UPDATE favorite_lists SET song_count = song_count - 1, favorite_list_duration = favorite_list_duration - (SELECT song_duration FROM songs WHERE song_id = ?) WHERE uid = ?`;
            db.query(updateFavoriteListQuery, [song_id, uid], (err, result) => {
                if (err) return res.json({ error: err.message });
                return res.json({ message: 'Song removed from favorites successfully' });
            });
        });
    });
});

app.post('/getPlaylists', (req, res) => {
    const uid = req.body.uid;
    const sql = 'SELECT * FROM playlists WHERE uid = ?';
    db.query(sql, [uid], (err, data) => {
        if (err) return res.json({ error: err.message });
        return res.json(data);
    });
});


app.post('/createPlaylist', (req, res) => {
    const uid = req.body.uid;
    const playlistImage = 'https://static.vecteezy.com/system/resources/thumbnails/001/200/758/small/music-note.png';
    const sql = 'INSERT INTO playlists (uid, playlist_name, playlist_image, song_count, playlist_duration) VALUES (?, "Плейлист", ?, 0, 0)';
    db.query(sql, [uid, playlistImage], (err, result) => {
        if (err) return res.json({ error: err.message });
        return res.json({ message: 'Playlist created successfully' });
    });
});


app.listen(8081, () => {
    console.log('http://localhost:8081');
})
