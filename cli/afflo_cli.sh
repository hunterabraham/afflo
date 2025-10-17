#!/bin/bash

# Source all command scripts
source "$(dirname "$0")/commands/init_router.sh"

# Main CLI command handler
case "$1" in
  "init-router")
    init_router "${@:2}"
    ;;
  *)
    echo "Unknown command: $1"
    echo "Available commands:"
    echo "  init-router    Initialize a new tRPC router"
    exit 1
    ;;
esac
