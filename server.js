import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();
app.use(cors())
const db =mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '',
    database: 'music_player'
})

app.get ('/', (re,res)=>{
    return res.json ('from backend side');
})

app.get ('/authors', (req,res)=>{
    const sql = 'SELECT * FROM authors';
    db.query(sql, (err, data)=> {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get ('/songs', (req,res)=>{
    const sql = 'SELECT * FROM songs';
    db.query(sql, (err, data)=> {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/songsAndAuthors', (req, res) => {
    const sql = 'SELECT songs.*, authors.author_name AS song_author FROM songs LEFT JOIN authors ON songs.author_id = authors.author_id';
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});


app.get ('/albums', (req,res)=>{
    const sql = 'SELECT * FROM albums';
    db.query(sql, (err, data)=> {
        if(err) return res.json(err);
        return res.json(data);
    })
})



app.listen (8081, ()=>{
    console.log('http://localhost:8081');
})

