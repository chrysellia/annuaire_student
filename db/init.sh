#!/bin/bash

# Wait for MySQL to be ready
echo "⏳ Waiting for MariaDB to be ready..."
until mysqladmin ping -h"localhost" --silent; do
  sleep 1
done
echo "✅ MariaDB is ready"

# Create user with access on all hosts using env variable
echo "🔧 Creating user '$DB_USER' with access on '%'..."
mysql -u root -p"$MARIADB_ROOT_PASSWORD" <<EOF
CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON *.* TO '$DB_USER'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EOF