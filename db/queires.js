import pool from "./db.js";

async function getAllCategory() {
	const query = "SELECT * FROM category ORDER BY id";
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

async function getCategoryNames() {
	const query = "SELECT id, name FROM category";
	const { rows } = await pool.query(query);
	return rows;
}

async function insertProduct(product) {
	const query = "INSERT INTO product(name, qtd_stock, price, category_id) VALUES ($1, $2, $3, $4)";
	await pool.query(query, [product.name, product.stock, product.price, product.category]);
}

async function updateCategory(id, category) {
	const query = "UPDATE category SET name = $1, description = $2 WHERE id = $3";
	await pool.query(query, [category.name, category.description, id]);
}

async function deleteCategory(id) {
	try {
		const query = "DELETE FROM category WHERE id = $1";
		await pool.query(query, [id]);
	} catch (error) {
		console.error("Error updating category:", error);
	}
}

async function updateProduct(id, product) {
	try {
	const query = "UPDATE product SET name = $1, qtd_stock = $2, price = $3, category_id = $4 WHERE id = $5";
	await pool.query(query, [product.name, product.stock, product.price, product.category, id]);
	} catch (error) {
		console.error("Error updating product:", error);
	}
}

async function deleteProduct(id) {
	try {
		const query = "DELETE FROM product WHERE id = $1";
		await pool.query(query, [id]);
	} catch (error) {
		console.error("Error deleting product:", error);
	}
}

export { getAllCategory, getAllProduct, getSingleProduct, getSingleCategory, insertCategory, getCategoryNames, insertProduct, updateCategory, deleteCategory, updateProduct, deleteProduct };
