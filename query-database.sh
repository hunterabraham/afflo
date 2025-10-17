#!/usr/bin/env bash
# Use this script to connect to the database and run queries

# Check if database is running in Docker
if docker ps | grep -q afflo-postgres; then
  echo "Connecting to database in Docker container..."
  docker exec -it afflo-postgres psql -U postgres -d ${DB_NAME:-afflo}
elif [ -f .env ]; then
  # Try to connect using .env file
  source .env
  
  DB_PASSWORD=$(echo "$DATABASE_URL" | awk -F':' '{print $3}' | awk -F'@' '{print $1}')
  DB_PORT=$(echo "$DATABASE_URL" | awk -F':' '{print $4}' | awk -F'\/' '{print $1}')
  DB_NAME=$(echo "$DATABASE_URL" | awk -F'/' '{print $4}')
  DB_USER=$(echo "$DATABASE_URL" | awk -F':' '{print $2}' | sed 's/\/\///')
  DB_HOST=$(echo "$DATABASE_URL" | awk -F'@' '{print $2}' | awk -F':' '{print $1}')
  
  echo "Connecting to database at $DB_HOST:$DB_PORT..."
  PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME"
else
  echo "❌ No database found. Please start your database or create a .env file."
  exit 1
fi

