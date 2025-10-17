# Overview

This is a create-t3-app project that uses Next.js, tRPC, and Drizzle ORM.

## Project Structure

The project is organized into the following directories:

- `src/app`: The main application directory.
- `src/server`: The server directory.
- `src/ui`: The UI directory.
- `src/lib`: The library directory.
- `src/types`: The type directory.

## Database

The database is a PostgreSQL database that is hosted in a Docker container.

The database is used to store the data for the application. It is hosted in a Docker container and is accessed via the `DATABASE_URL` environment variable.

When you are creating tables or queries, be sure to be aware of indexes. We want to leverage indexes to improve performance.

### Drizzle ORM

We use Drizzle ORM to interact with the database.

## Docker

### Development

#### Start everything:

```bash
docker-compose up -d
```

#### Run migrations:

```bash
docker-compose exec app npm run db:push
```

#### Start everything with hot reload:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

#### View logs

```bash
docker-compose logs -f
```

#### Stop containers

```bash
docker-compose down
```

#### Rebuild after code changes

```bash
docker-compose build app && docker-compose up -d app
```

#### Access database

```bash
docker-compose exec database psql -U postgres -d afflo
```

#### View running containers

```bash
docker-compose ps
```
