import pool from "./db.js";

async function getAllCategory() {
	const query = "SELECT * FROM category";
	const { rows } = await pool.query(query);
	return rows;
}

async function getAllProduct() {
	const query = "SELECT * FROM product";
	const { rows } = await pool.query(query);
	return rows;
}

export { getAllCategory, getAllProduct };
