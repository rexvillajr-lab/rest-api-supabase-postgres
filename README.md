# Supabase Backend

Backend scaffold for a Node.js, Express, and Sequelize API that connects to Supabase Postgres.

## Structure

- `src/app.js` - Express app setup.
- `src/server.js` - HTTP server entry point.
- `src/config` - Environment and Sequelize CLI config.
- `src/database` - Sequelize instance, migrations, and seeders.
- `src/models` - Sequelize model definitions.
- `src/routes` - Route registration.
- `src/controllers` - Request/response handlers.
- `src/services` - Business logic.
- `src/repositories` - Database access logic.
- `src/middlewares` - Express middleware.
- `src/validators` - Request validation schemas.
- `src/utils` - Shared helpers.
- `tests` - Unit and integration tests.

## Next Steps

Install dependencies when ready:

```bash
npm install express sequelize pg pg-hstore dotenv cors helmet morgan
npm install -D nodemon sequelize-cli jest supertest
```

Then copy `.env.example` to `.env` and fill in your Supabase Postgres connection string.

## Users API

- `POST /api/users` - Create a user.
- `GET /api/users` - List users.
- `GET /api/users/:id` - Get one user.
- `PATCH /api/users/:id` - Update a user.
- `DELETE /api/users/:id` - Delete a user.

Run the users table migration after installing dependencies and configuring `.env`:

```bash
npm run db:migrate
```
