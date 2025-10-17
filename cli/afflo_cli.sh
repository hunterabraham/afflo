#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Change to project root for all commands
cd "$PROJECT_ROOT"

# Source all command scripts
source "$SCRIPT_DIR/commands/init_router.sh"
source "$SCRIPT_DIR/commands/docker_reset.sh"

# Main CLI command handler
case "$1" in
  "init-router")
    init_router "${@:2}"
    ;;
  "docker-reset")
    docker_reset "${@:2}"
    ;;
  *)
    echo "Unknown command: $1"
    echo ""
    echo "🚀 Afflo CLI - Available commands:"
    echo ""
    echo "  init-router      Initialize a new tRPC router"
    echo "  docker-reset     Reset Docker environment (stop, clean, start, migrate, seed)"
    echo ""
    exit 1
    ;;
esac
