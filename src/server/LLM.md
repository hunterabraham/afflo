# Overview

This directory contains the tRPC server code for the Afflo application.

## Best Practices

### Error Handling

Always use the custom error classes in the `api/error.ts` file to throw errors. This will ensure that the error is properly formatted and returned to the client.

### Imports

NEVER use relative imports in the server code. Always use the `~/` prefix to import files.
