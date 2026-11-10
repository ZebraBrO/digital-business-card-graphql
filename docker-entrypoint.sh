#!/bin/sh
set -e

echo "Applying PostgreSQL migrations..."
npx prisma migrate deploy

echo "Seeding PostgreSQL database..."
npx prisma db seed

echo "Starting NestJS application..."
exec node dist/main
