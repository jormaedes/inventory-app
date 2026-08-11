import { Pool } from "pg";
import process from "process";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
})

export default pool;