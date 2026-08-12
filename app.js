import express from 'express';
import process from 'process';
import path from 'path';
import { validationResult } from 'express-validator';
import { 
	getAllCategory, 
	getAllProduct, 
	getSingleProduct, 
	getSingleCategory, 
	insertCategory, 
	getCategoryNames, 
	insertProduct,
	updateCategory,
	deleteCategory,
	updateProduct,
	deleteProduct
} from './db/queires.js';

import productValidationRules from './validators/productValidator.js';
import categoryValidationRules from './validators/categoryValidator.js';
import productRouter from './routers/productRouter.js';

const __dirname = import.meta.dirname;
const PORT = process.env.PORT || 3000;
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.get('/', async (req, res) => {
	res.render('index');
})

app.use('/products', productRouter);

app.get('/categories', async (req, res) => {
	const categories = await getAllCategory();
	res.render('allcategories', { categories: categories });
});

app.get('/categories/new', async (req, res) => {
	res.render('addcategory');
})

app.post('/categories/new', categoryValidationRules, async (req, res) => {
	const { name, description } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).send(errors);
	}
	await insertCategory({name, description});
	res.redirect('/categories');
})


app.get('/categories/:id/edit', async (req, res)=>{
	const { id } = req.params;
	const category = await getSingleCategory(Number.parseInt(id));
	if (!category)
	{
		res.redirect('/');
		return;
	}
	res.render('editcategory', {category: category});
})

app.get('/categories/:id/delete', async (req, res) => {
	try {
	const { id } = req.params;
	await deleteCategory(Number.parseInt(id));
	res.redirect('/categories');
	} catch (error) {
		res.status(500).send('Error deleting category because it is associated with products. Please delete the associated products first.');
	}
})

app.post('/categories/:id/edit', categoryValidationRules, async (req, res) => {
	const { id } = req.params;
	const { name, description } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).send(errors);
	}
	await updateCategory(Number.parseInt(id), {name, description});
	res.redirect('/categories');
	return ;
});

app.use((req, res, next) => {
	// console.error(err.stack);
	res.status(500).send('Something went wrong!');
});


app.listen(PORT, async () => {
	console.log(`App is running in port ${PORT}`);
});