#!/bin/bash

# Script to initialize a new tRPC router file
# Usage: ./afflo_cli.sh init-router <entity-name>

init_router() {
    # Forward to the actual init-router.sh script
    "$(dirname "$0")/../init-router.sh" "$@"
}

