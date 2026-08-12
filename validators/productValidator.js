import { body } from "express-validator";

const productValidationRules = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage("Product name is required")
		.isLength({ min: 2, max: 100 })
		.withMessage("Product name must be between 2 and 100 characters"),

	body("stock")
		.trim()
		.notEmpty()
		.withMessage("Stock quantity is required")
		.isInt({ min: 0 })
		.withMessage("Stock quantity must be a non-negative integer"),

	body("price")
		.trim()
		.notEmpty()
		.withMessage("Price is required")
		.isFloat({ min: 0 })
		.withMessage("Price must be a positive number"),

	body("category")
		.trim()
		.notEmpty()
		.withMessage("Category is required")
		.isInt({ min: 1 })
		.withMessage("Category must be a valid category id"),
];

export default productValidationRules;