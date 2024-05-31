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

// User avatar

const imagesDir = './public/images/';

if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imagesDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${uniqueSuffix}_${file.originalname}`);
    }
});

const avatarUpload = multer({
    storage: avatarStorage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG and PNG files are allowed!'), false);
        }
    }
});

app.post('/upload', avatarUpload.single('file'), (req, res) => {
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

app.post('/loadAvatar', async (req, res) => {
    const uid = req.body.uid;
    const sql = 'SELECT uphoto FROM users WHERE uid = ?';
    db.query(sql, uid, (err, data) => {
        if (err) return res.json({ error: err.message });
        return res.json({ uphoto: data[0].uphoto });
    });
});

// General API

app.get('/songsAndAuthors', (req, res) => {
    const sql = 'SELECT songs.*, authors.author_name AS song_author FROM songs LEFT JOIN authors ON songs.author_id = authors.author_id';
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Favorites

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

app.post('/favoriteInfo', (req, res) => {
    const uid = req.body.uid;
    const get = 'SELECT * FROM favorite_lists WHERE uid = ?';
    db.query(get, [uid], (err, data) => {
        if (err) return res.json({ error: err.message });
        return res.json(data);
    });
});

// Playlist

app.post('/getPlaylists', (req, res) => {
    const uid = req.body.uid;
    const sql = 'SELECT * FROM playlists WHERE uid = ?';
    db.query(sql, [uid], (err, data) => {
        if (err) return res.json({ error: err.message });
        return res.json(data);
    });
});

// app.post('/getPlaylist', (req, res) => {
//     const id = req.body.playlist_id;
//     const sqlGet = 'SELECT song_count, playlist_duration FROM playlists WHERE playlist_id = ?';
//     db.query(sqlGet, [id], (err, data) => {
//         if (err) return res.json({ Error: "Error retrieving playlist data" });
//         return res.json(data[0]);
//     });
// });

app.post('/createPlaylist', (req, res) => {
    const uid = req.body.uid;
    const playlistImage = 'https://cdn-icons-png.flaticon.com/512/483/483041.png';
    const sql = 'INSERT INTO playlists (uid, playlist_name, playlist_image, song_count, playlist_duration) VALUES (?, "Плейлист", ?, 0, 0)';
    db.query(sql, [uid, playlistImage], (err, result) => {
        if (err) return res.json({ error: err.message });
        return res.json({ message: 'Playlist created successfully' });
    });
});

app.post('/deletePlaylist', (req, res) => {
    const playlist_id = req.body.playlistid;
    const deletePlayListSongs = 'DELETE FROM playlists_songs WHERE playlist_id = ?';
    db.query(deletePlayListSongs, [playlist_id], (err, result) => {
        if (err) return res.json({ error: err.message });
        const deletePlayList = 'DELETE FROM playlists WHERE playlist_id = ?';
        db.query(deletePlayList, [playlist_id], (err, result) => {
            if (err) return res.json({ error: err.message });
            return res.json({ message: 'Playlist and associated songs deleted successfully' });
        });
    });
});

app.post('/getPlaylistSongs', (req, res) => {
    const { playlist_id } = req.body;
    const sql = `SELECT songs.*, authors.author_name AS song_author FROM playlists_songs JOIN songs ON playlists_songs.song_id = songs.song_id LEFT JOIN authors ON songs.author_id = authors.author_id WHERE playlists_songs.playlist_id = ?`;
    db.query(sql, [playlist_id], (err, data) => {
        if (err) return res.json({ error: err.message });
        return res.json(data);
    });
});

app.post('/addSongToPlaylist', (req, res) => {
    const { playlist_id, song_id } = req.body;
    const checkIfExistsQuery = 'SELECT * FROM playlists_songs WHERE playlist_id = ? AND song_id = ?';
    db.query(checkIfExistsQuery, [playlist_id, song_id], (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result.length > 0) return res.json({ message: 'Пісня вже є в списку' });
        const insertQuery = 'INSERT INTO playlists_songs (playlist_id, song_id) VALUES (?, ?)';
        db.query(insertQuery, [playlist_id, song_id], (err, result) => {
            if (err) return res.json({ error: err.message });
            const updatePlaylistQuery = `UPDATE playlists SET song_count = song_count + 1, playlist_duration = playlist_duration + (SELECT song_duration FROM songs WHERE song_id = ?) WHERE playlist_id = ?`;
            db.query(updatePlaylistQuery, [song_id, playlist_id], (err, result) => {
                if (err) return res.json({ error: err.message });
                return;
            });
        });
    });
});

app.post('/removeSongFromPlaylist', (req, res) => {
    const { playlist_id, song_id } = req.body;
    const deleteQuery = 'DELETE FROM playlists_songs WHERE playlist_id = ? AND song_id = ?';
    const updatePlaylistQuery = `UPDATE playlists SET song_count = song_count - 1, playlist_duration = playlist_duration - (SELECT song_duration FROM songs WHERE song_id = ?) WHERE playlist_id = ?`;
    db.query(deleteQuery, [playlist_id, song_id], (err, result) => {
        if (err) return res.json({ error: err.message });
        db.query(updatePlaylistQuery, [song_id, playlist_id], (err, result) => {
            if (err) return res.json({ error: err.message });
            return res.json({ message: 'Song removed from playlist successfully' });
        });
    });
});

app.post('/checkSongInPlaylist', (req, res) => {
    const { playlist_id, song_id } = req.body;
    const sql = 'SELECT * FROM playlists_songs WHERE playlist_id = ? AND song_id = ?';
    db.query(sql, [playlist_id, song_id], (err, data) => {
        if (err) return res.json({ error: err.message });
        return res.json({ isInPlaylist: data.length > 0 });
    });
});

app.post('/updatePlaylistName', (req, res) => {
    const playlist_id = req.body.id;
    const newName = req.body.inputValue;
    if (!newName || newName.trim() === '') { return; }
    const sqlUpdate = 'UPDATE playlists SET playlist_name = ? WHERE playlist_id = ?';
    db.query(sqlUpdate, [newName, playlist_id], (err, result) => {
        if (err) return res.json({ Error: "Error updating playlist name" });
        return res.json({ Status: "Name updated successfully" });
    });
});

app.post('/getPlaylistName', (req, res) => {
    const playlist_id = req.body.id;
    const sqlGet = 'SELECT playlist_name FROM playlists WHERE playlist_id = ?';
    db.query(sqlGet, [playlist_id], (err, data) => {
        if (err) return res.json({ Error: "Error updating playlist name" });
        return res.json(data);
    });
})

// Authors && Albums

app.post('/authors', (req, res) => {
    const sql = 'SELECT * FROM authors';
    db.query(sql, (err, data) => {
        if (err) return res.json({ error: err.message });
        return res.json(data);
    });
});

app.post('/albums', (req, res) => {
    const sql = 'SELECT * FROM albums';
    db.query(sql, (err, data) => {
        if (err) return res.json({ error: err.message });
        return res.json(data);
    });
});

app.post('/songsByAuthor', (req, res) => {
    const author_id = req.body.author_id;
    const sql = `SELECT songs.*, authors.author_name AS song_author, albums.album_name AS album_name FROM songs LEFT JOIN authors ON songs.author_id = authors.author_id LEFT JOIN albums ON songs.album_id = albums.album_id WHERE songs.author_id = ?`;
    db.query(sql, [author_id], (err, data) => {
        if (err) return res.json({ error: err.message });
        return res.json(data);
    });
});

app.post('/songsByAlbum', (req, res) => {
    const album_id = req.body.album_id;
    const sql = `SELECT songs.*, authors.author_name AS song_author, albums.album_name AS album_name FROM songs LEFT JOIN authors ON songs.author_id = authors.author_id LEFT JOIN albums ON songs.album_id = albums.album_id WHERE songs.album_id = ?`;
    db.query(sql, [album_id], (err, data) => {
        if (err) return res.json({ error: err.message });
        return res.json(data);
    });
});

// Default playlists

app.post('/defaultPlaylists', (req, res) => {
    const sql = 'SELECT * FROM default_playlists';
    db.query(sql, (err, data) => {
        if (err) return res.json({ error: err.message });
        return res.json(data);
    });
});

app.post('/defaultPlaylistSongs', (req, res) => {
    const sql = `SELECT songs.*, default_playlist_items.default_playlist_id AS default_playlist_id, authors.author_name AS song_author FROM songs JOIN default_playlist_items ON songs.song_id = default_playlist_items.song_id LEFT JOIN default_playlists ON default_playlist_items.default_playlist_id = default_playlists.default_playlist_id LEFT JOIN authors ON songs.author_id = authors.author_id`;
    db.query(sql, (err, data) => {
        if (err) return res.json({ error: err.message });
        return res.json(data);
    });
});

// Listen

app.listen(8081, () => {
    console.log('http://localhost:8081');
})