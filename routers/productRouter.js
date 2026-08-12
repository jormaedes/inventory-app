import { Router } from "express";
import { validationResult } from "express-validator";
import { 
	getAllProduct,
	getSingleProduct,
	getCategoryNames,
	insertProduct,
	updateProduct,
	deleteProduct
} from "../db/queires.js";
import productValidationRules from "../validators/productValidator.js";

const productRouter = Router();

productRouter.get('/', async (req, res) => {
	const products = await getAllProduct();
	res.render('allproducts', { products: products })
});

productRouter.get('/new', async (req, res) => {
	const categories = await getCategoryNames();
	res.render('addproducts', {categories: categories})
});

productRouter.post('/new', productValidationRules, async (req, res) => {
	const {name, price, stock, category } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).send(errors);
	}
	await insertProduct({name, price, stock, category});
	res.redirect('/products');
});

productRouter.get('/:id/edit', async (req, res)=>{
	const { id } = req.params;
	const product = await getSingleProduct(Number.parseInt(id));
	const allCategories = await getCategoryNames();
	if (!product)
	{
		res.redirect('/products');
		return;
	}
	res.render('editproduct', {product: product, categories: allCategories});
})

productRouter.post('/:id/edit', productValidationRules, async (req, res) => {
	const { id } = req.params;
	const { name, price, stock, category } = req.body;
	const allCategories = await getCategoryNames();
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).send(errors);
	}
	await updateProduct(Number.parseInt(id), {name, price, stock, category});
	res.redirect('/products');
	return ;
});

productRouter.get('/:id/delete', async (req, res)=>{
	const { id } = req.params;
	await deleteProduct(Number.parseInt(id));
	res.redirect('/products');
})

export default productRouter;