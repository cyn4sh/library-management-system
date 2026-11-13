# Library Management System

A full-stack library management system. This repository currently contains the backend: a NestJS API with a PostgreSQL database managed through Prisma, covering catalog CRUD (genres and books) and JWT authentication with role-based access.

## Assignment Files (Week 1: Design & Migrate Your Library Schema)

| Requirement | File |
| --- | --- |
| `Role` enum (`PATRON`, `LIBRARIAN`), `User` model using it, `Genre` model, `Book` model with `genreId` foreign key and `@relation` | [api/prisma/schema.prisma](https://github.com/cyn4sh/library-management-system/blob/main/api/prisma/schema.prisma) |
| Seed script: 4 genres and 16 books | [api/prisma/seed.ts](https://github.com/cyn4sh/library-management-system/blob/main/api/prisma/seed.ts) |
| `PrismaService` extends `PrismaClient`, implements `OnModuleInit`, calls `this.$connect()` | [api/src/prisma/prisma.service.ts](https://github.com/cyn4sh/library-management-system/blob/main/api/src/prisma/prisma.service.ts) |
| `DATABASE_URL` placeholder, no real credentials | [api/.env.example](https://github.com/cyn4sh/library-management-system/blob/main/api/.env.example) |
| Schema decisions: why `Book` references `Genre` | [Schema Decisions](#schema-decisions) below |
| Migration applied to hosted PostgreSQL | [api/prisma/migrations/20261104143143_init/migration.sql](https://github.com/cyn4sh/library-management-system/blob/main/api/prisma/migrations/20261104143143_init/migration.sql) |

## Assignment Files (Week 2: Complete Book API, Auth & Authorization)

| Requirement | File |
| --- | --- |
| Full CRUD for `Genre` (create, findAll, findOne, update, remove) | [genres.controller.ts](https://github.com/cyn4sh/library-management-system/blob/main/api/src/genres/genres.controller.ts), [genres.service.ts](https://github.com/cyn4sh/library-management-system/blob/main/api/src/genres/genres.service.ts), [genres.module.ts](https://github.com/cyn4sh/library-management-system/blob/main/api/src/genres/genres.module.ts) |
| `class-validator` decorators on every book field | [api/src/books/dto/create-book.dto.ts](https://github.com/cyn4sh/library-management-system/blob/main/api/src/books/dto/create-book.dto.ts) |
| `GET /books` reads `genreId`, `search`, `page`, `limit` from `@Query()`; create, update and delete are guarded | [api/src/books/books.controller.ts](https://github.com/cyn4sh/library-management-system/blob/main/api/src/books/books.controller.ts) |
| `findAll()` builds a Prisma `where` clause and applies `skip`/`take` | [api/src/books/books.service.ts](https://github.com/cyn4sh/library-management-system/blob/main/api/src/books/books.service.ts) |
| `POST /auth/register` and `POST /auth/login`, passwords hashed with bcrypt | [auth.controller.ts](https://github.com/cyn4sh/library-management-system/blob/main/api/src/auth/auth.controller.ts), [auth.service.ts](https://github.com/cyn4sh/library-management-system/blob/main/api/src/auth/auth.service.ts), [auth.module.ts](https://github.com/cyn4sh/library-management-system/blob/main/api/src/auth/auth.module.ts) |
| `JwtStrategy` verifies tokens using `JWT_SECRET`; `JwtAuthGuard` extends `AuthGuard('jwt')` | [jwt.strategy.ts](https://github.com/cyn4sh/library-management-system/blob/main/api/src/auth/jwt.strategy.ts), [jwt-auth.guard.ts](https://github.com/cyn4sh/library-management-system/blob/main/api/src/auth/jwt-auth.guard.ts) |
| `@Roles()` decorator and `RolesGuard` checking `req.user.role` | [roles.decorator.ts](https://github.com/cyn4sh/library-management-system/blob/main/api/src/auth/roles.decorator.ts), [roles.guard.ts](https://github.com/cyn4sh/library-management-system/blob/main/api/src/auth/roles.guard.ts) |
| Global `ValidationPipe({ whitelist: true })` and `enableCors()` | [api/src/main.ts](https://github.com/cyn4sh/library-management-system/blob/main/api/src/main.ts) |
| Postman collection with a request for every endpoint | [docs/postman_collection.json](https://github.com/cyn4sh/library-management-system/blob/main/docs/postman_collection.json) |
| Migration adding `password`, `isbn` and `totalCopies` | [api/prisma/migrations/20261113073206_add_auth_and_book_fields/migration.sql](https://github.com/cyn4sh/library-management-system/blob/main/api/prisma/migrations/20261113073206_add_auth_and_book_fields/migration.sql) |

## Tech Stack

- NestJS and TypeScript (backend)
- PostgreSQL, hosted on Supabase
- Prisma 7 (schema, migrations, client)
- `class-validator` and `class-transformer` (request validation)
- `@nestjs/jwt`, `@nestjs/passport` and `passport-jwt` (authentication)
- `bcrypt` (password hashing)

## Project Structure

```
library-management-system/
├── api/
│   ├── prisma/
│   │   ├── schema.prisma     # Data models
│   │   ├── seed.ts           # Sample genres and books
│   │   └── migrations/       # SQL migrations
│   ├── src/
│   │   ├── prisma/           # PrismaModule and PrismaService
│   │   ├── genres/           # Genre CRUD
│   │   ├── books/            # Book CRUD, search and pagination
│   │   ├── auth/             # Register, login, JWT strategy, guards
│   │   └── main.ts           # ValidationPipe and CORS
│   └── .env.example          # Environment variable template
├── docs/
│   └── postman_collection.json
└── README.md
```

## Getting Started

1. Install dependencies:

   ```bash
   cd api
   npm install
   ```

2. Create your environment file from the template and fill in your own values:

   ```bash
   cp .env.example .env
   ```

3. Generate a JWT secret and put it in `.env` as `JWT_SECRET`:

   ```bash
   openssl rand -hex 32
   ```

4. Apply the migrations and generate the Prisma client:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Seed the database with 4 genres and 16 books:

   ```bash
   npx tsx prisma/seed.ts
   ```

   The seed clears existing books before inserting, so it is safe to run more than once. Each book gets a generated ISBN and 3 copies.

6. Start the API:

   ```bash
   npm run start:dev
   ```

   The API listens on `http://localhost:3000`.

## API Endpoints

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Create an account. New users are `PATRON`. |
| POST | `/auth/login` | Public | Returns an `access_token` (JWT). |
| GET | `/genres` | Public | List all genres. |
| GET | `/genres/:id` | Public | Get one genre. |
| POST | `/genres` | Public | Create a genre. |
| PATCH | `/genres/:id` | Public | Update a genre. |
| DELETE | `/genres/:id` | Public | Delete a genre (fails if it still has books). |
| GET | `/books` | Public | List books with filtering, search and pagination. |
| GET | `/books/:id` | Public | Get one book. |
| POST | `/books` | `LIBRARIAN` | Create a book. |
| PATCH | `/books/:id` | `LIBRARIAN` | Update a book. |
| DELETE | `/books/:id` | `LIBRARIAN` | Delete a book. |

### Listing books

`GET /books` accepts these query parameters:

| Parameter | Description |
| --- | --- |
| `genreId` | Only books in this genre. |
| `search` | Case-insensitive match on title or author. |
| `page` | Page number, starting at 1 (default 1). |
| `limit` | Books per page (default 10, maximum 100). |

The response has a `data` array and a `meta` object with `total`, `page`, `limit` and `totalPages`.

### Authentication

Send the token from `/auth/login` in the `Authorization` header as `Bearer <token>`. Create, update and delete routes for books return `401` without a valid token and `403` for a token that does not belong to a `LIBRARIAN`.

Registration always creates a `PATRON`, because the `role` field is stripped from the request. To promote an account to librarian, update the row directly in the database:

```sql
UPDATE "User" SET role = 'LIBRARIAN' WHERE email = 'someone@example.com';
```

The user must log in again afterwards, because the role is stored inside the token.

### Postman

Import `docs/postman_collection.json` into Postman. Run **Login** first: it saves the token into a collection variable that the guarded requests use automatically.

## Data Models

| Model | Purpose |
| --- | --- |
| `User` | A library member. Has a hashed `password` and a `role` of `PATRON` (default) or `LIBRARIAN`. |
| `Genre` | A book category, such as Fiction or Science. Names are unique. |
| `Book` | A catalog entry with a unique `isbn`, `totalCopies`, and `publicationYear`. Belongs to exactly one `Genre` through `genreId`. |

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

### Why passwords are hashed and logins give one error

Passwords are hashed with bcrypt before saving, so the database never holds a usable password. Login returns the same "Invalid email or password" error for an unknown email and a wrong password, so an attacker cannot tell which accounts exist.

## Environment Variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string. See `api/.env.example` for the format. Never commit the real value. |
| `JWT_SECRET` | Secret used to sign and verify JWTs. Generate it with `openssl rand -hex 32`. Never commit the real value. |