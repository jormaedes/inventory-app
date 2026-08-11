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

export { getAllCategory, getAllProduct };
