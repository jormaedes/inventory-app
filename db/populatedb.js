#!/usr/bin/env node
// populatedb.js
// Usage: node populatedb.js <OPTIONAL_DATABASE_URL>
// If no argument is passed, it uses process.env.DATABASE_URL (from .env)

// import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const connectionString = process.argv[2] || process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "Error: no connection string found. Set DATABASE_URL in your .env or pass it as an argument."
  );
  process.exit(1);
}

const pool = new Pool({ connectionString });

const SQL_CREATE_TABLES = `
  CREATE TABLE IF NOT EXISTS category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    qtd_stock INTEGER NOT NULL DEFAULT 0,
    price NUMERIC(10, 2) NOT NULL,
    category_id INTEGER REFERENCES category(id) ON DELETE RESTRICT
  );
`;

const categories = [
  { name: "Electronics", description: "Electronic devices and components" },
  { name: "Computers", description: "Computers, peripherals and accessories" },
  { name: "Office", description: "Office supplies and furniture" },
  { name: "Home and Kitchen", description: "Kitchen utensils and appliances" },
];

// category_index refers to the position in the `categories` array above (0-based)
const products = [
  { name: "Smartphone Galaxy A14", qtd_stock: 25, price: 189.99, category_index: 0 },
  { name: "USB-C Charger 20W", qtd_stock: 120, price: 12.5, category_index: 0 },
  { name: "Bluetooth Earbuds", qtd_stock: 40, price: 24.99, category_index: 0 },

  { name: "Dell Inspiron 15 Laptop", qtd_stock: 8, price: 549.0, category_index: 1 },
  { name: "USB Optical Mouse", qtd_stock: 60, price: 7.99, category_index: 1 },
  { name: "Mechanical Keyboard", qtd_stock: 15, price: 34.5, category_index: 1 },
  { name: "SSD 500GB", qtd_stock: 30, price: 39.99, category_index: 1 },

  { name: "A4 Ruled Notebook", qtd_stock: 200, price: 1.99, category_index: 2 },
  { name: "Office Chair", qtd_stock: 10, price: 89.9, category_index: 2 },
  { name: "Ballpoint Pens (pack of 10)", qtd_stock: 80, price: 3.5, category_index: 2 },

  { name: "Blender 600W", qtd_stock: 12, price: 29.99, category_index: 3 },
  { name: "Non-stick Pan 24cm", qtd_stock: 18, price: 17.5, category_index: 3 },
];

async function createTables(client) {
  console.log("Creating tables (if they don't exist)...");
  await client.query(SQL_CREATE_TABLES);
}

async function insertCategories(client) {
  console.log("Inserting categories...");
  const insertedIds = [];

  for (const cat of categories) {
    const result = await client.query(
      "INSERT INTO category (name, description) VALUES ($1, $2) RETURNING id",
      [cat.name, cat.description]
    );
    insertedIds.push(result.rows[0].id);
    console.log(`  -> Category created: ${cat.name} (id: ${result.rows[0].id})`);
  }

  return insertedIds;
}

async function insertProducts(client, categoryIds) {
  console.log("Inserting products...");

  for (const prod of products) {
    const categoryId = categoryIds[prod.category_index];
    const result = await client.query(
      `INSERT INTO product (name, qtd_stock, price, category_id)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [prod.name, prod.qtd_stock, prod.price, categoryId]
    );
    console.log(`  -> Product created: ${prod.name} (id: ${result.rows[0].id})`);
  }
}

async function main() {
  const client = await pool.connect();

  try {
    console.log("Connecting to the database...");
    await client.query("BEGIN");

    await createTables(client);
    const categoryIds = await insertCategories(client);
    await insertProducts(client, categoryIds);

    await client.query("COMMIT");
    console.log("\nDone! Database populated successfully.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("\nFailed to populate the database. Rolled back.");
    console.error(err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();