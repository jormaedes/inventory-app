import express from 'express';
import process from 'process';
import path from 'path';
import pool from './db/db.js';


const __dirname = import.meta.dirname;
const PORT = process.env.PORT || 3000;
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res)=> {
	res.send('<h1>Inventory App</h1>');
})

app.listen(PORT, async ()=>{
	console.log(`App listenig in port ${PORT}`);
});