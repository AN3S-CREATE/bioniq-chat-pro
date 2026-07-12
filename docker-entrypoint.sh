#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "Running Prisma migrations and db push..."
npx prisma db push

echo "Seeding database with legacy Taskade project dumps..."
npx tsx prisma/seed.ts

echo "Starting Next.js application..."
exec node server.js
