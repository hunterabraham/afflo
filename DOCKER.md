# Docker Setup Guide

This guide explains how to run your application with Docker containers.

## Prerequisites

- Docker installed on your system
- Docker Compose installed (usually comes with Docker Desktop)

## Quick Start

### 1. Create Environment File

Copy your existing `.env` file or create one with the following variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@database:5432/afflo"
DB_PASSWORD=postgres
DB_NAME=afflo
DB_PORT=5432

# Application Configuration
APP_PORT=3000

# NextAuth Configuration
AUTH_SECRET=your-auth-secret-here
AUTH_DISCORD_ID=your-discord-client-id
AUTH_DISCORD_SECRET=your-discord-client-secret
```

**Important**: For the `DATABASE_URL`, use `database` as the hostname (not `localhost`) since that's the service name in docker-compose.

### 2. Build and Start Containers

```bash
# Build and start all services
docker-compose up -d

# Or build first, then start
docker-compose build
docker-compose up -d
```

### 3. Run Database Migrations

After the containers are running, execute migrations:

```bash
# Push schema to database
docker-compose exec app npm run db:push

# Or generate and run migrations
docker-compose exec app npm run db:generate
docker-compose exec app npm run db:migrate
```

### 4. Access Your Application

- **Application**: http://localhost:3000
- **Database**: localhost:5432

## Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f database
```

### Stop Containers

```bash
docker-compose down
```

### Stop and Remove Volumes (WARNING: Deletes all data)

```bash
docker-compose down -v
```

### Rebuild After Code Changes

```bash
docker-compose build app
docker-compose up -d app
```

### Access Container Shell

```bash
# App container
docker-compose exec app sh

# Database container
docker-compose exec database psql -U postgres -d afflo
```

### View Running Containers

```bash
docker-compose ps
```

## Production Deployment

For production deployments:

1. **Set Strong Passwords**: Update `DB_PASSWORD` and `AUTH_SECRET` with strong, random values
2. **Environment Variables**: Never commit `.env` files with secrets
3. **Database Backups**: Set up regular backups of the `postgres_data` volume
4. **SSL/TLS**: Configure SSL for database connections in production
5. **Reverse Proxy**: Use nginx or similar in front of the app container

### Example Production docker-compose Override

Create a `docker-compose.prod.yml`:

```yaml
version: "3.9"

services:
  database:
    ports: [] # Don't expose database port publicly

  app:
    environment:
      - NODE_ENV=production
    restart: always
```

Run with:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Database Connection Issues

If the app can't connect to the database:

1. Ensure the `DATABASE_URL` uses `database` as hostname, not `localhost`
2. Check database health: `docker-compose ps`
3. View database logs: `docker-compose logs database`

### Port Already in Use

If port 3000 or 5432 is already in use:

1. Change `APP_PORT` or `DB_PORT` in `.env`
2. Stop conflicting services
3. Use different ports: `docker-compose up -d` with modified `.env`

### Build Failures

If the build fails:

1. Check Docker has enough resources (RAM/disk space)
2. Clear build cache: `docker-compose build --no-cache`
3. Remove old images: `docker system prune -a`

### Environment Variables Not Loading

1. Ensure `.env` file is in the same directory as `docker-compose.yml`
2. Check variable names match exactly
3. Restart containers: `docker-compose restart`

## Development Workflow

For local development, you can:

1. **Run database in Docker, app locally**:

   ```bash
   docker-compose up -d database
   npm run dev
   ```

   Update `DATABASE_URL` to use `localhost` instead of `database`

2. **Run everything in Docker**:
   ```bash
   docker-compose up -d
   ```
   Make code changes and rebuild when needed

## Architecture

The Docker setup consists of:

- **Database Container**: PostgreSQL 16 with persistent volume storage
- **App Container**: Next.js application with tRPC server built in standalone mode
- **Network**: Both containers communicate via a Docker network
- **Volumes**: Database data persisted in `postgres_data` volume

## Next Steps

- Configure health checks for monitoring
- Set up automated backups
- Implement log aggregation
- Add container monitoring (e.g., Prometheus, Grafana)
- Consider using Docker secrets for sensitive data
