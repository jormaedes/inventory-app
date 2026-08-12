import pool from "./db.js";

async function getAllCategory() {
	const query = "SELECT * FROM category";
	const { rows } = await pool.query(query);
	return rows;
}

async function getAllProduct() {
	const query = "SELECT product.id, product.name, qtd_stock, price, category.name as category_name FROM product JOIN category ON product.category_id = category.id";
	const { rows } = await pool.query(query);
	return rows;
}

async function getSingleProduct(id) {
	const query = `
  SELECT product.id, product.name, qtd_stock, price, category.name AS category_name
  FROM product
  JOIN category ON product.category_id = category.id
  WHERE product.id = $1
`;
	const { rows } = await pool.query(query, [id]);
	const product = rows[0];
	return product;
}

async function getSingleCategory(id) {
	const query = `SELECT * FROM category WHERE id = $1`;
	const { rows } = await pool.query(query, [id]);
	const category = rows[0];
	return category;
}

async function insertCategory(category) {
	const query = "INSERT INTO category(name, description) VALUES ($1, $2)";
	await pool.query(query, [category.name, category.description]);
}

export { getAllCategory, getAllProduct, getSingleProduct, getSingleCategory, insertCategory };
