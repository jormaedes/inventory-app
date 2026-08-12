import { Router } from "express";
import { validationResult } from "express-validator";
import { 
	getAllCategory,
	getSingleCategory,
	insertCategory,
	updateCategory,
	deleteCategory
} from "../db/queires.js";
import categoryValidationRules from "../validators/categoryValidator.js";

const categoryRouter = Router();

categoryRouter.get('/', async (req, res) => {
	try {
		const categories = await getAllCategory();
		res.render('allcategories', { categories: categories });
	} catch (err) {
		res.status(500).render('error', { status: 500, message: 'Failed to load categories.', details: err.message });
	}
});

categoryRouter.get('/new', async (req, res) => {
	res.render('addcategory');
})

categoryRouter.post('/new', categoryValidationRules, async (req, res) => {
	const { name, description } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).render('error', { status: 400, message: 'Validation failed.', errors: errors.array() });
	}
	try {
		await insertCategory({name, description});
		res.redirect('/categories');
	} catch (err) {
		res.status(500).render('error', { status: 500, message: 'Failed to insert category.', details: err.message });
	}
})


categoryRouter.get('/:id/edit', async (req, res)=>{
	const { id } = req.params;
	try {
		const category = await getSingleCategory(Number.parseInt(id));
		if (!category) {
			res.redirect('/');
			return;
		}
		res.render('editcategory', {category: category});
	} catch (err) {
		res.status(500).render('error', { status: 500, message: 'Failed to load category.', details: err.message });
	}
})

categoryRouter.get('/:id/delete', async (req, res) => {
	try {
		const { id } = req.params;
		await deleteCategory(Number.parseInt(id));
		res.redirect('/categories');
	} catch (error) {
		res.status(500).render('error', { status: 500, message: 'Error deleting category. It may be associated with products.', details: error.message });
	}
})

categoryRouter.post('/:id/edit', categoryValidationRules, async (req, res) => {
	const { id } = req.params;
	const { name, description } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).render('error', { status: 400, message: 'Validation failed.', errors: errors.array() });
	}
	try {
		await updateCategory(Number.parseInt(id), {name, description});
		res.redirect('/categories');
		return ;
	} catch (err) {
		res.status(500).render('error', { status: 500, message: 'Failed to update category.', details: err.message });
	}
});

export default categoryRouter;