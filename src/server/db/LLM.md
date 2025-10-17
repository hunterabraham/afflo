# Overview

This directory contains the database schema and initialization for the Afflo database.

## Schema

The schema is defined the `schema.ts` file. This file is used to define the tables and relationships between them. It uses the Drizzle ORM to define the schema.

## Initialization

The initialization is defined the `index.ts` file. This file is used to initialize the database and the schema. It uses the Drizzle ORM to initialize the database and the schema.

## Migrations

The migrations are defined the `migrations` directory. This directory is used to define the migrations for the database. It uses the Drizzle ORM to define the migrations.

## Best Practices

### Indexes

When you are creating tables or queries, be sure to be aware of indexes. We want to leverage indexes to improve performance.

### Foreign Keys

Always use foreign keys to enforce referential integrity. Use SET NULL on the foreign key column to prevent cascade deletes.

### Timestamps

Always use the `updated_at` and `created_at` columns to track changes to the data. The `updated_at` column should be updated on every update, and the `created_at` column should be set to the current timestamp on creation. Use hooks to automatically set the `updated_at` column on every update.

### Deletion

ALWAYS opt for soft deletion over hard deletion. Use the `deleted_at` column to track the deletion of the data. Always include a `deleted_at` column in your tables and use it to filter out deleted data. Add an index on the `deleted_at` column to improve performance.
