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
	try {
		const products = await getAllProduct();
		res.render('allproducts', { products: products })
	} catch (err) {
		res.status(500).render('error', { status: 500, message: 'Failed to load products.', details: err.message });
	}
});

productRouter.get('/new', async (req, res) => {
	try {
		const categories = await getCategoryNames();
		res.render('addproducts', {categories: categories})
	} catch (err) {
		res.status(500).render('error', { status: 500, message: 'Failed to load categories for product creation.', details: err.message });
	}
});

productRouter.post('/new', productValidationRules, async (req, res) => {
	const {name, price, stock, category } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).render('error', { status: 400, message: 'Validation failed.', errors: errors.array() });
	}
	try {
		await insertProduct({name, price, stock, category});
		res.redirect('/products');
	} catch (err) {
		res.status(500).render('error', { status: 500, message: 'Failed to insert product.', details: err.message });
	}
});

productRouter.get('/:id/edit', async (req, res)=>{
	const { id } = req.params;
	try {
		const product = await getSingleProduct(Number.parseInt(id));
		const allCategories = await getCategoryNames();
		if (!product) {
			res.redirect('/products');
			return;
		}
		res.render('editproduct', {product: product, categories: allCategories});
	} catch (err) {
		res.status(500).render('error', { status: 500, message: 'Failed to load product for editing.', details: err.message });
	}
})

productRouter.post('/:id/edit', productValidationRules, async (req, res) => {
	const { id } = req.params;
	const { name, price, stock, category } = req.body;
	const allCategories = await getCategoryNames();
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).render('error', { status: 400, message: 'Validation failed.', errors: errors.array() });
	}
	try {
		await updateProduct(Number.parseInt(id), {name, price, stock, category});
		res.redirect('/products');
		return ;
	} catch (err) {
		res.status(500).render('error', { status: 500, message: 'Failed to update product.', details: err.message });
	}
});

productRouter.get('/:id/delete', async (req, res)=>{
	try {
		const { id } = req.params;
		await deleteProduct(Number.parseInt(id));
		res.redirect('/products');
	} catch (err) {
		res.status(500).render('error', { status: 500, message: 'Failed to delete product.', details: err.message });
	}
})

export default productRouter;