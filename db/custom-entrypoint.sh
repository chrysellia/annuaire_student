#!/bin/bash
# Start MySQL in the background
docker-entrypoint.sh mariadbd &

# Wait for MySQL to be ready
echo "⏳ Waiting for MariaDB to be ready..."
until mysqladmin ping --silent; do
    sleep 1
done

# Run your custom script
echo "🚀 Running init.sh..."
/init.sh

# Wait for mysqld to exit
wait
