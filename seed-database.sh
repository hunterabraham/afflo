#!/usr/bin/env bash
# Use this script to seed the database with sample data

# import env variables from .env
set -a
source .env

DB_PASSWORD=$(echo "$DATABASE_URL" | awk -F':' '{print $3}' | awk -F'@' '{print $1}')
DB_PORT=$(echo "$DATABASE_URL" | awk -F':' '{print $4}' | awk -F'\/' '{print $1}')
DB_NAME=$(echo "$DATABASE_URL" | awk -F'/' '{print $4}')
DB_USER=$(echo "$DATABASE_URL" | awk -F':' '{print $2}' | sed 's/\/\///')
DB_HOST=$(echo "$DATABASE_URL" | awk -F'@' '{print $2}' | awk -F':' '{print $1}')

if ! [ -x "$(command -v psql)" ]; then
  echo "psql is not installed. Please install PostgreSQL client and try again."
  echo "Install guide: https://www.postgresql.org/download/"
  exit 1
fi

echo "Seeding database '$DB_NAME' on $DB_HOST:$DB_PORT..."

# Run the seed SQL file
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f seed.sql

if [ $? -eq 0 ]; then
  echo "✅ Database seeded successfully!"
else
  echo "❌ Error seeding database. Please check the output above."
  exit 1
fi

