# Pinion's Catalog

A high-performance, full-stack product catalog system built with modern technologies and optimized database patterns.

# SnapCatalog API
A backend service for browsing large product catalogs with efficient cursor-based pagination.

This project was built as part of the CodeVector Backend Take-Home Assignment.

## Overview
The service supports:

- Browsing products ordered by newest first
- Filtering products by category
- Cursor-based pagination
- Product creation and updates
- Category management
- Seeding 200,000+ products
The primary goal was to build a solution that remains fast and correct while the dataset grows and while products are being added or updated.

---

## Tech Stack

- Bun
- TypeScript
- Hono
- PostgreSQL
- Drizzle ORM
- Neon Database

---

## Why Cursor Pagination?
Traditional offset pagination:

```
SELECT *
FROM products
ORDER BY updated_at DESC
LIMIT 20 OFFSET 100000;
```
has two major issues:

1. Performance degrades as offsets grow.
2. Inserts and updates can cause duplicates or skipped records while users are browsing.
This project uses cursor-based pagination instead.

Products are ordered using:

```
ORDER BY updated_at DESC, id DESC
```
The cursor stores:

```
{
  "id": 123,
  "updatedAt": "2026-06-22T12:00:00Z"
}
```
encoded as a Base64 URL-safe string.

The next page is fetched using:

```
updated_at < cursorUpdatedAt
OR (
    updated_at = cursorUpdatedAt
    AND id < cursorId
)
```
This ensures stable traversal of the dataset.

---

## Why Use Both updated_at and id?
Multiple products may share the same timestamp.

Using only updated_at can cause duplicate or missing products between pages.

Using:

```
(updated_at, id)
```
creates a deterministic ordering and guarantees correct pagination.

---

## Database Indexes
Two composite indexes are used:

### Feed Pagination

```
(updated_at DESC, id DESC)
```
Used for:

```
ORDER BY updated_at DESC, id DESC
```

### Category Feed Pagination

```
(category_id, updated_at DESC, id DESC)
```
Used for:

```
WHERE category_id = ?
ORDER BY updated_at DESC, id DESC
```
These indexes allow PostgreSQL to traverse rows directly without sorting large portions of the table.

---

## API Endpoints

### Health Check

```
GET /
```

### Products

#### Get Products

```
GET /api/v1/products
```
Query Parameters:

```
cursor (optional)
limit (optional, max 100)
```

Example:

```
GET /api/v1/products?limit=5
```
Response:

```
{  "products": [...],  "nextCursor": "..."}
```

Then:

```
GET /api/v1/products?limit=5&cursor=...
```

#### Get Product By ID

```
GET /api/v1/products/:id
```

#### Create Product

```
POST /api/v1/products
```
Body:

```
{
  "name": "Product Name",
  "description": "Description",
  "category_id": 1,
  "price": 100
}
```

#### Update Product

```
PATCH /api/v1/products/:id
```
Body:

```
{
  "name": "Updated Product",
  "description": "Updated Description",
  "category_id": 1,
  "price": 200
}
```

#### Get Products By Category

```
GET /api/v1/products/category/:categoryId
```
Query Parameters:

```
cursor (optional)
limit (optional, max 100)
```

---

### Categories

#### Get Categories

```
GET /api/v1/categories
```

#### Get Category By ID

```
GET /api/v1/categories/:id
```

#### Create Category

```
POST /api/v1/categories
```
Body:

```
{
  "name": "Electronics"
}
```

---

## Running Locally
Install dependencies:

```
bun install
```
Generate migrations:

```
bun run db:generate
```
Apply migrations:

```
bun run db:migrate
```
Seed the database:

```
bun run seed
```
Run the server:

```
bun run dev
```

---

## Seeding
The project includes a seed script capable of generating 200,000+ products.

Products are inserted in batches to avoid excessive memory usage and improve insertion performance.

---

## What I Would Improve With More Time

- Snapshot-based pagination for fully consistent browsing during concurrent updates
- API documentation with Swagger/OpenAPI
- Integration tests
- Rate limiting
- Dockerized deployment
- Query performance benchmarks

---

## AI Usage
AI was used as a development assistant for:

- Architecture discussions
- Reviewing pagination approaches
- Explaining database indexing strategies
- Reviewing edge cases
All implementation details, testing, debugging, and final design decisions were verified manually.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Design](#database-design)
- [Pagination Strategy](#pagination-strategy)
- [Performance Optimization](#performance-optimization)
- [API Documentation](#api-documentation)
- [Development](#development)

---

## Architecture Overview

This is a monorepo containing:
- **Backend**: Node.js API server using Hono framework
- **Frontend**: React SPA with Vite
- **Shared**: Shared types and utilities
- **Database**: PostgreSQL with Drizzle ORM

The architecture emphasizes **performance and scalability** with cursor-based pagination and optimized database indexes.

---

## Tech Stack

### Backend
- **Runtime**: Node.js / Bun
- **Framework**: Hono (lightweight HTTP framework)
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Middleware**: CORS, compression, timing, secure headers
- **Validation**: Zod

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: CSS

### Database Migrations
- **Tool**: Drizzle migrations
- **Format**: SQL snapshots in `backend/drizzle/`

---

## Project Structure

```
.
├── backend/                    # Node.js/Hono API server
│   ├── src/
│   │   ├── index.ts           # Main app entry point
│   │   ├── controllers/       # Request handlers
│   │   │   └── product.controller.ts
│   │   ├── services/          # Business logic
│   │   │   └── product.service.ts
│   │   ├── repositories/      # Data access layer
│   │   │   └── product.repository.ts
│   │   ├── routes/            # API route definitions
│   │   │   ├── product.route.ts
│   │   │   └── category.route.ts
│   │   ├── db/                # Database configuration
│   │   │   ├── index.ts
│   │   │   └── schema.ts
│   │   ├── scripts/           # Utility scripts
│   │   │   └── seed.ts        # Database seeding
│   │   └── utils/             # Utilities
│   │       └── encryption.util.ts
│   ├── drizzle/               # Database migrations & snapshots
│   ├── drizzle.config.ts      # Drizzle configuration
│   └── package.json
│
├── frontend/                  # React + Vite SPA
│   ├── src/
│   │   ├── main.tsx           # Entry point
│   │   ├── App.tsx            # Root component
│   │   └── assets/            # Static assets
│   ├── vite.config.ts
│   └── package.json
│
├── shared/                    # Shared code (types, utilities)
├── package.json               # Root workspace config
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Bun (optional, for faster package management)

### Installation

1. **Clone and install dependencies**:
```bash
# Install root dependencies
npm install

# Dependencies are installed for each workspace (backend, frontend, shared)
```

2. **Configure environment variables**:

Create `.env` in the backend directory:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/pinion_catalog
NODE_ENV=development
PORT=8000
```

3. **Set up the database**:
```bash
cd backend

# Run migrations
npx drizzle-kit migrate

# Seed initial data (optional)
npx tsx src/scripts/seed.ts
```

### Running the Application

**Backend**:
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:8000`

**Frontend**:
```bash
cd frontend
npm run dev
```
Application runs on `http://localhost:5173`

---

## Database Design

### Schema Overview

**Products Table**:
- `id` (primary key)
- `name` (product name)
- `description` (detailed description)
- `price` (product price)
- `category_id` (foreign key to categories)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Categories Table**:
- `id` (primary key)
- `name` (category name)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Critical Indexes

```sql
-- Composite index for cursor pagination
CREATE INDEX products_updated_at_id_idx ON products(updated_at DESC, id DESC);

-- Category lookup index
CREATE INDEX products_category_id_idx ON products(category_id);
```

---

## Pagination Strategy

### ❌ Why NOT Offset Pagination?

Offset pagination has severe limitations at scale:

```
Query: SELECT * FROM products OFFSET 1000000 LIMIT 10

Problems:
- O(n) complexity: Database must skip 1M rows before returning results
- Duplicate/missing records: Data can shift between requests
- Memory intensive: Large offset values consume significant resources
- Unpredictable performance: Slower queries as offset increases
```

### ✅ Why Cursor Pagination?

Cursor pagination is **O(limit)** and maintains consistency:

```
Request 1: GET /api/v1/products?limit=20
Response includes: products array + cursor for next page

Request 2: GET /api/v1/products?cursor=<CURSOR>&limit=20
Database: SELECT * FROM products 
          WHERE (updated_at, id) < (?, ?)
          ORDER BY updated_at DESC, id DESC
          LIMIT 20
```

**Benefits**:
- **Consistent**: Uses index efficiently, no duplicates or gaps
- **Fast**: O(limit) complexity, independent of offset
- **Stable**: Handles concurrent updates gracefully
- **Scalable**: Works perfectly with millions of records

---

## Performance Optimization

### 1. Composite Index Strategy

**Why `(updated_at, id)`?**

```
Problem:
- updated_at alone is NOT unique
- Multiple products can share the same timestamp
- This violates the requirement for stable, deterministic ordering

Solution:
- Use (updated_at, id) as a composite key
- updated_at provides logical ordering (recent first)
- id acts as a tie-breaker for records with identical timestamps
- Guarantees deterministic, stable ordering
```

**Example**:
```
Product A: updated_at=2026-06-22 10:00:00, id=1
Product B: updated_at=2026-06-22 10:00:00, id=2
Product C: updated_at=2026-06-22 10:00:01, id=3

When paginating, (updated_at, id) ensures consistent ordering:
Cursor at Product C: Next query filters (updated_at, id) < (2026-06-22 10:00:01, 3)
Always returns Products A & B in correct order
```

### 2. Index Efficiency

**Why indexes matter**:

```
Without index:
- Full table scan: O(n)
- Database reads entire table
- Filters each row in memory
- Catastrophic for large datasets

With composite index:
- Index traverse: O(log n)
- Database uses index tree structure
- Direct access to filtered results
- Consistent sub-millisecond response times
```

The index matches the query order (`ORDER BY updated_at DESC, id DESC`), allowing PostgreSQL to traverse the index directly without sorting.

### 3. Batch Seeding

The seed script inserts products in batches of 1000 to prevent:
- Memory overflow with large datasets
- Connection timeouts
- Database lock contention

```typescript
// Insert 200,000 products in batches of 1,000
// Each batch is inserted separately, avoiding RAM saturation
createProducts(200_000);
```

---

## API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Products Endpoints

#### Get Products (with Cursor Pagination)
```http
GET /api/v1/products?limit=20&cursor=<CURSOR>

Query Parameters:
- limit: Number of products per page (default: 20, max: 100)
- cursor: Base64-encoded pagination cursor (from previous response)

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Product A",
      "description": "Description...",
      "price": 99.99,
      "category_id": 1,
      "created_at": "2026-06-22T10:00:00Z",
      "updated_at": "2026-06-22T10:00:00Z"
    },
    ...
  ],
  "cursor": "<NEXT_CURSOR>",
  "hasMore": true
}
```

#### Get Product by ID
```http
GET /api/v1/products/:id

Response:
{
  "success": true,
  "data": { ... }
}
```

#### Create Product
```http
POST /api/v1/products

Body:
{
  "name": "New Product",
  "description": "Description",
  "price": 49.99,
  "category_id": 1
}

Response: { success: true, data: { ...created product } }
```

#### Update Product
```http
PATCH /api/v1/products/:id

Body: { name?, description?, price?, category_id? }

Response: { success: true, data: { ...updated product } }
```

#### Delete Product
```http
DELETE /api/v1/products/:id

Response: { success: true }
```

### Categories Endpoints

Similar CRUD operations available at:
- `GET /api/v1/categories`
- `GET /api/v1/categories/:id`
- `POST /api/v1/categories`
- `PATCH /api/v1/categories/:id`
- `DELETE /api/v1/categories/:id`

---

## Development

### Database Migrations

Create a new migration:
```bash
cd backend
npx drizzle-kit generate postgresql
```

Run migrations:
```bash
npx drizzle-kit migrate
```

Push schema changes to DB:
```bash
npx drizzle-kit push postgresql
```

### Database Seeding

Seed the database with test data:
```bash
cd backend
npx tsx src/scripts/seed.ts
```

Options:
```typescript
// Seed 200 categories
createCategories(200);

// Seed 200,000 products (in batches of 1,000)
createProducts(200_000);
```

### Project Scripts

**Backend**:
```bash
npm run dev        # Start development server
npm run build      # Compile TypeScript
npm run start      # Run compiled code
```

**Frontend**:
```bash
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## Key Design Decisions

| Decision | Reason |
|----------|--------|
| **Cursor Pagination** | Scales infinitely, consistent ordering, prevents duplicate/missing records |
| **(updated_at, id) Index** | Ensures deterministic ordering even with concurrent updates |
| **Batch Seeding** | Prevents memory overflow and connection timeouts |
| **Hono Framework** | Lightweight, type-safe, excellent TypeScript support |
| **Drizzle ORM** | Type-safe SQL builder, minimal overhead, perfect for Node.js |
| **Repository Pattern** | Separates data access from business logic, testable code |

---

## Performance Expectations

Expected performance characteristics:

- Cursor pagination complexity is O(limit)
- Composite indexes prevent full table scans

---

## Troubleshooting

### Database connection failed
- Verify PostgreSQL is running: `psql -U postgres -d postgres`
- Check `DATABASE_URL` in `.env` file
- Ensure database exists: `createdb pinion_catalog`

### Migrations not applying
```bash
cd backend
npx drizzle-kit drop  # Reset (dev only!)
npx drizzle-kit push  # Re-apply all migrations
```

### Slow queries
- Check indexes exist: `\d products` in psql
- Run `ANALYZE;` to update table statistics
- Check EXPLAIN PLAN: `EXPLAIN ANALYZE SELECT ... `

---

## License

Proprietary - Pinion's Catalog

---

## Author

Built with performance and scalability in mind.
