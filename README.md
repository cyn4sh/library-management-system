# Library Management System

A full-stack library management system. This repository currently contains the backend data layer: a NestJS API with a PostgreSQL database managed through Prisma.

## Tech Stack

- NestJS and TypeScript (backend)
- PostgreSQL, hosted on Supabase
- Prisma 7 (schema, migrations, client)

## Project Structure

```
library-management-system/
├── api/
│   ├── prisma/
│   │   ├── schema.prisma     # Data models
│   │   ├── seed.ts           # Sample genres and books
│   │   └── migrations/       # SQL migrations
│   ├── src/prisma/           # PrismaModule and PrismaService
│   └── .env.example          # Environment variable template
└── README.md
```

## Getting Started

1. Install dependencies:

   ```bash
   cd api
   npm install
   ```

2. Create your environment file from the template and fill in your own database URL:

   ```bash
   cp .env.example .env
   ```

3. Apply the migrations and generate the Prisma client:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. Seed the database with 4 genres and 16 books:

   ```bash
   npx tsx prisma/seed.ts
   ```

   The seed clears existing books before inserting, so it is safe to run more than once.

5. Start the API:

   ```bash
   npm run start:dev
   ```

## Data Models

| Model | Purpose |
| --- | --- |
| `User` | A library member. Has a `role` of `PATRON` (default) or `LIBRARIAN`. |
| `Genre` | A book category, such as Fiction or Science. Names are unique. |
| `Book` | A catalog entry. Belongs to exactly one `Genre` through `genreId`. |

## Schema Decisions

### Why `Book` references `Genre` instead of embedding it

Each `Book` stores only a `genreId`, a foreign key pointing to a row in the `Genre` table. It does not carry a copy of the genre inside the book record. This was chosen for these reasons:

- **One source of truth.** A genre's name is stored once. Renaming "Science" to "Natural Science" is a single update, and every book reflects it. With embedding, the same change would mean editing every book record.
- **No inconsistent duplicates.** Embedded genre text invites variants like "Fiction", "fiction" and "Fictoin". With a reference, a genre exists once and books point to it.
- **Integrity enforced by the database.** The foreign key means a book cannot point to a genre that does not exist, and a genre that still has books cannot be removed by accident.
- **Natural queries.** Listing all books in a genre, or counting books per genre, is a simple join on `genreId`. This is the kind of one-to-many relationship (one genre, many books) that relational databases are designed for.
- **Genres can grow.** If genres later gain a description or a cover image, that data lives in one place and no book records change.

Every book must have a genre, so `genreId` is required and the relation is not optional.

### Why `Role` is an enum

`Role` is a database enum with two allowed values, `PATRON` and `LIBRARIAN`. This prevents invalid values such as a misspelled role, and new users default to `PATRON`.

### Why `PrismaService` is a shared provider

`PrismaService` extends `PrismaClient` and is exported from `PrismaModule`, so one shared database connection is injected wherever it is needed instead of each part of the app creating its own.

## Environment Variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string. See `api/.env.example` for the format. Never commit the real value. |