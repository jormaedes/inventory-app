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
	const categories = await getAllCategory();
	res.render('allcategories', { categories: categories });
});

categoryRouter.get('/new', async (req, res) => {
	res.render('addcategory');
})

categoryRouter.post('/new', categoryValidationRules, async (req, res) => {
	const { name, description } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).send(errors);
	}
	await insertCategory({name, description});
	res.redirect('/categories');
})


categoryRouter.get('/:id/edit', async (req, res)=>{
	const { id } = req.params;
	const category = await getSingleCategory(Number.parseInt(id));
	if (!category)
	{
		res.redirect('/');
		return;
	}
	res.render('editcategory', {category: category});
})

categoryRouter.get('/:id/delete', async (req, res) => {
	try {
	const { id } = req.params;
	await deleteCategory(Number.parseInt(id));
	res.redirect('/categories');
	} catch (error) {
		res.status(500).send('Error deleting category because it is associated with products. Please delete the associated products first.');
	}
})

categoryRouter.post('/:id/edit', categoryValidationRules, async (req, res) => {
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

export default categoryRouter;