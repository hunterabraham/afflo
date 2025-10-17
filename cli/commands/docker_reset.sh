#!/bin/bash

# Script to reset Docker environment: stop containers, remove volumes, restart, migrate, and seed
# Usage: ./afflo_cli.sh docker-reset

docker_reset() {
    echo "🔄 Resetting Docker environment..."
    echo ""
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    # Stop all containers
    echo "📦 Stopping containers..."
    docker-compose down
    
    # Remove the database volume
    echo "🗑️  Removing database volume..."
    docker volume rm afflo_postgres_data 2>/dev/null || echo "   (Volume didn't exist or already removed)"
    
    # Start database service
    echo "🚀 Starting database..."
    docker-compose up -d database
    
    # Wait for database to be healthy
    echo "⏳ Waiting for database to be ready..."
    timeout=30
    counter=0
    until docker exec afflo-postgres pg_isready -U postgres > /dev/null 2>&1; do
        sleep 1
        counter=$((counter + 1))
        if [ $counter -ge $timeout ]; then
            echo "❌ Database failed to start within ${timeout} seconds"
            exit 1
        fi
    done
    echo "✅ Database is ready!"
    
    # Run migrations
    echo "🔧 Running database migrations..."
    npm run db:push
    
    if [ $? -ne 0 ]; then
        echo "❌ Migration failed"
        exit 1
    fi
    echo "✅ Migrations completed!"
    
    # Seed database
    echo "🌱 Seeding database..."
    ./seed-database.sh
    
    if [ $? -ne 0 ]; then
        echo "❌ Seeding failed"
        exit 1
    fi
    
    echo ""
    echo "✨ Docker environment reset complete!"
    echo ""
    echo "📊 Database stats:"
    docker exec -i afflo-postgres psql -U postgres -d afflo -c "
        SELECT 'Users: ' || COUNT(*) FROM afflo_user
        UNION ALL
        SELECT 'Partners: ' || COUNT(*) FROM afflo_partner
        UNION ALL
        SELECT 'Affiliates: ' || COUNT(*) FROM afflo_affiliate
        UNION ALL
        SELECT 'Events: ' || COUNT(*) FROM afflo_affiliate_event;
    " 2>/dev/null || echo "   (Could not fetch stats)"
    
    echo ""
    echo "🎯 Next steps:"
    echo "   • Start the app: docker-compose up app"
    echo "   • Query database: ./query-database.sh"
    echo "   • View logs: docker logs afflo-postgres"
}

