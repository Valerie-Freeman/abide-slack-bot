#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for PostgreSQL..."
while ! pg_isready -h db -p 5432 -U postgres; do
  sleep 1
done
echo "PostgreSQL is ready!"

# Apply database migrations
echo "Applying database migrations..."
flask db upgrade

# Start the application
echo "Starting application..."
exec "$@"
