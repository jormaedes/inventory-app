import express from 'express';
import process from 'process';
import path from 'path';
import { getAllCategory, getAllProduct, getSingleProduct, getSingleCategory } from './db/queires.js';

const __dirname = import.meta.dirname;
const PORT = process.env.PORT || 3000;
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get('/', async (req, res) => {
	res.render('index');
})

app.get('/categories', async (req, res) => {
	const categories = await getAllCategory();
	res.render('allcategories', { categories: categories });
});

app.get('/products', async (req, res) => {
	const products = await getAllProduct();
	res.render('allproducts', { products: products })
});

app.get('/products/:id', async (req, res)=>{
	const { id } = req.params;
	const product = await getSingleProduct(Number.parseInt(id));
	if (!product)
	{
		res.redirect('/');
		return;
	}
	res.send(product);
})

app.get('/categories/:id', async (req, res)=>{
	const { id } = req.params;
	const category = await getSingleCategory(Number.parseInt(id));
	if (!category)
	{
		res.redirect('/');
		return;
	}
	res.send(category);
})

app.listen(PORT, async () => {
	console.log(`App is running in port ${PORT}`);
});