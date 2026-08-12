import { body } from "express-validator";

const categoryValidationRules = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage("Category name is required")
		.isLength({ min: 2, max: 100 })
		.withMessage("Category name must be between 2 and 100 characters"),

	body("description")
		.trim()
		.optional({ values: "falsy" })
		.isLength({ max: 500 })
		.withMessage("Description must not exceed 500 characters"),
];

export default categoryValidationRules;