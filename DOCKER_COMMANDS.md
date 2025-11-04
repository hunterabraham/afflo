# Docker Commands

This project uses two independent Docker Compose files that can be run separately.

## 1. PostgreSQL with Fresh Seed Data

Starts a PostgreSQL database instance, runs migrations, and seeds it with fresh data from `seed.sql`.

### Command:

```bash
docker-compose -f docker-postgres.yml up
```

### What it does:

1. Starts a PostgreSQL 16 database container
2. Waits for the database to be ready
3. Runs database migrations (`npm run db:push`)
4. Seeds the database with data from `seed.sql`

### Environment Variables:

- `DB_PASSWORD` (default: `postgres`)
- `DB_NAME` (default: `afflo`)
- `DB_PORT` (default: `5432`)

### To run in background:

```bash
docker-compose -f docker-postgres.yml up -d
```

### To stop:

```bash
docker-compose -f docker-postgres.yml down
```

### To reset and get fresh data:

```bash
docker-compose -f docker-postgres.yml down -v
docker-compose -f docker-postgres.yml up
```

## 2. Node Server

Starts the Node.js server with hot reloading using `npm run server:dev`.

### Command:

```bash
docker-compose -f docker-server.yml up
```

### What it does:

1. Starts a Node.js 20 container
2. Installs dependencies
3. Runs `npm run server:dev` with hot reloading

### Environment Variables:

- `DATABASE_URL` (default: `postgresql://postgres:postgres@host.docker.internal:5432/afflo`)
- `PORT` (default: `8080`)
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `AUTH_SHOPIFY_ID`
- `AUTH_SHOPIFY_SECRET`
- `CORS_ORIGIN` (default: `http://localhost:3000`)

### Connecting to PostgreSQL:

- If PostgreSQL is running on your host machine (localhost), the default `DATABASE_URL` will work.
- If PostgreSQL is running in Docker, you can:
  1. Use the same Docker network by creating one and adding both services to it
  2. Or set `DATABASE_URL` to use the container name: `postgresql://postgres:postgres@afflo-postgres:5432/afflo` (requires both on same network)

### To run in background:

```bash
docker-compose -f docker-server.yml up -d
```

### To stop:

```bash
docker-compose -f docker-server.yml down
```

## Running Both Together

If you want to run both services and have them communicate:

1. **Option 1: Use host networking** (if postgres is on host)
   - Start postgres: `docker-compose -f docker-postgres.yml up -d`
   - Start server: `docker-compose -f docker-server.yml up`

2. **Option 2: Create a shared network**
   ```bash
   docker network create afflo-network
   docker-compose -f docker-postgres.yml up -d
   docker network connect afflo-network afflo-postgres
   # Then update docker-server.yml to use the same network
   ```

## Notes

- Both commands can be run independently
- The postgres setup automatically runs migrations and seeds data
- The server setup includes hot reloading for development
- Source code is mounted as volumes, so changes are reflected immediately
