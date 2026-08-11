import express from 'express';
import process from 'process';
import path from 'path';
import { getAllCategory } from './db/queires.js';

const __dirname = import.meta.dirname;
const PORT = process.env.PORT || 3000;
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get('/', async (req, res) => {
	res.render('index');
})

app.get('/categories', async (req, res)=>{
	const categories = await getAllCategory();
	res.render('allcategories', { categories: categories });
})

app.listen(PORT, async ()=>{
	console.log(`App listenig in port ${PORT}`);
});