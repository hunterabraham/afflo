#!/bin/bash

# Script to initialize a new tRPC router file
# Usage: ./init-router.sh <entity-name>

if [ $# -eq 0 ]; then
    echo "Error: No entity name provided"
    echo "Usage: ./init-router.sh <entity-name>"
    echo "Example: ./init-router.sh product"
    exit 1
fi

ENTITY_NAME=$1
ENTITY_NAME_LOWER=$(echo "$ENTITY_NAME" | tr '[:upper:]' '[:lower:]')
ENTITY_NAME_PASCAL=$(echo "$ENTITY_NAME_LOWER" | sed 's/\(^\|_\)\([a-z]\)/\U\2/g')
ENTITY_NAME_PLURAL="${ENTITY_NAME_LOWER}s"

FILE_PATH="src/server/api/routers/${ENTITY_NAME_LOWER}.ts"

# Check if file already exists
if [ -f "$FILE_PATH" ]; then
    echo "Error: File $FILE_PATH already exists"
    exit 1
fi

# Create the router file
cat > "$FILE_PATH" << EOF
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { ${ENTITY_NAME_PLURAL} } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { NotFoundError } from "~/server/api/error";

export const ${ENTITY_NAME_LOWER}Router = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        // Add your input fields here
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [${ENTITY_NAME_LOWER}] = await ctx.db
        .insert(${ENTITY_NAME_PLURAL})
        .values({
          name: input.name,
          // Map your input fields here
        })
        .returning();

      return {
        ${ENTITY_NAME_LOWER},
        success: true,
      };
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const ${ENTITY_NAME_LOWER} = await ctx.db.query.${ENTITY_NAME_PLURAL}.findFirst({
        where: eq(${ENTITY_NAME_PLURAL}.id, input.id),
      });

      if (!${ENTITY_NAME_LOWER}) {
        throw new NotFoundError("${ENTITY_NAME_PASCAL} not found");
      }

      return ${ENTITY_NAME_LOWER} ?? null;
    }),
});
EOF

echo "✓ Created router file: $FILE_PATH"
echo ""
echo "Next steps:"
echo "1. Update the schema imports and table name in the file"
echo "2. Add your specific input fields to the create mutation"
echo "3. Add the router to src/server/api/root.ts"

