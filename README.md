# Inventory Application

A full-stack inventory management app built as part of [The Odin Project's](https://www.theodinproject.com/lessons/node-path-nodejs-inventory-application) Node.js curriculum. It allows users to manage product categories and products through a simple, styled interface, backed by a relational PostgreSQL database.

**Live demo:** https://inventory-app-five-rho.vercel.app/

## Features

- **Categories:** create, view, update, and delete product categories
- **Products:** create, view, update, and delete products, each linked to a category
- **Relational data:** one-to-many relationship between categories and products (a category can have many products)
- **Server-side validation:** all form inputs are validated with `express-validator` before hitting the database
- **Safe deletes:** categories cannot be deleted while they still have associated products (`ON DELETE RESTRICT`), preventing orphaned or accidentally lost data
- **Parameterized queries:** all SQL queries use placeholders (`$1`, `$2`, ...) to prevent SQL injection
- **Responsive UI:** styled with Tailwind CSS and Remixicon for a clean, icon-driven interface

## Tech Stack

| Layer          | Technology                          |
|----------------|--------------------------------------|
| Runtime        | Node.js                              |
| Framework      | Express                              |
| Templating     | EJS                                  |
| Database       | PostgreSQL                           |
| DB Driver      | [`pg`](https://www.npmjs.com/package/pg) |
| Validation     | `express-validator`                  |
| Styling        | Tailwind CSS v4                      |
| Icons          | Remixicon                            |
| Deployment     | Vercel                               |

## Database Schema

Two tables with a one-to-many relationship (one category → many products):

```sql
CREATE TABLE category (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE product (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  qtd_stock INTEGER NOT NULL DEFAULT 0,
  price NUMERIC(10, 2) NOT NULL,
  category_id INTEGER REFERENCES category(id) ON DELETE RESTRICT
);
```

`category_id` uses `ON DELETE RESTRICT`, so the database rejects any attempt to delete a category that still has products pointing to it. This is handled gracefully in the application layer with a clear error message to the user.

## Getting Started

### Prerequisites

- Node.js (v20 or later recommended)
- A PostgreSQL database (local or hosted, e.g. Neon, Render, Supabase)

### Installation

```bash
git clone https://github.com/jormaedes/inventory-app.git
cd inventory-app
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgres://user:password@host:5432/database_name
PORT=3000
```

### Seed the Database

A script is included to create the tables (if they don't exist) and populate them with sample categories and products:

```bash
node db/populatedb.js
```

You can also pass a connection string directly instead of relying on `.env`:

```bash
node db/populatedb.js postgres://user:password@host:5432/database_name
```

### Build Tailwind CSS

```bash
npm run build:css
```

This watches `views/**/*.ejs` and regenerates the compiled CSS on change.

### Run the App

```bash
npm start
```

The app will be available at `http://localhost:3000` (or the port set in `.env`).

## Project Structure

```
inventory-app/
├── db/					#Queries, Database seed script
├── routes/				# Express route definitions (category, product)
├── validators/			# express-validator rule sets
├── views/				# EJS templates
├── public/				# Static assets (compiled CSS, images)
├── app.js				# Express app entry point
└── .env				# Environment variables (not committed)
```

## What I Learned

- Designing a simple relational schema with a one-to-many relationship in PostgreSQL
- Handling delete operations safely with foreign key constraints (`ON DELETE RESTRICT`) instead of blindly cascading
- Writing parameterized SQL queries with `pg` to prevent SQL injection
- Structuring server-side form validation with `express-validator`
- Integrating Tailwind CSS v4 into a server-rendered EJS project
- Managing environment variables and database connections for production deployment on Vercel

## Author

**Jormaedes Luís**
GitHub: [@jormaedes](https://github.com/jormaedes)