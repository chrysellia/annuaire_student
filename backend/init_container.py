#!/usr/bin/env python3
"""
Container initialization script
Runs seeder only once and then starts the Flask app
"""

import os
import sys
import time
import subprocess
from pathlib import Path
from sqlalchemy import text
# Flag file to track if seeding has been done
SEED_FLAG_FILE = "seeded.flag"

def wait_for_database(max_attempts=30, delay=2):
    """Wait for database to be ready"""
    print("🔍 Waiting for database to be ready...")
    
    for attempt in range(max_attempts):
        try:
            # Try to import and test database connection
            from classes.database.database_manager import DatabaseManager
            from classes.mapping.mapping import Mapping
            from settings import mapping
            
            db_manager = DatabaseManager(mapping.DB_DEFAULT)
            
            # Test connection
            with db_manager.engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            
            print("✅ Database is ready!")
            return True
            
        except Exception as e:
            print(f"⏳ Database not ready (attempt {attempt + 1}/{max_attempts}): {e}")
            if attempt < max_attempts - 1:
                time.sleep(delay)
            else:
                print("❌ Database connection timeout!")
                return False
    
    return False

def run_seeder_if_needed():
    """Run seeder only if it hasn't been run before"""
    if os.path.exists(SEED_FLAG_FILE):
        print("✅ Database already seeded (flag file exists)")
        return True
    
    print("🌱 Running database seeder for the first time...")
    try:
        from seeder import Seeder
        seeder = Seeder()
        success = seeder.run_full_seed()
        
        if success:
            # Create flag file to indicate seeding is complete
            Path(SEED_FLAG_FILE).touch()
            print("✅ Seeding completed and flag file created")
            return True
        else:
            print("❌ Seeding failed!")
            return False
            
    except Exception as e:
        print(f"💥 Seeder error: {e}")
        import traceback
        traceback.print_exc()
        # Remove flag file if it was created in error
        if os.path.exists(SEED_FLAG_FILE):
            os.remove(SEED_FLAG_FILE)
        return False

def start_flask_app():
    """Start the Flask application"""
    print("🚀 Starting Flask application...")
    try:
        # Import and run the Flask app
        import app
        
        # Check if we're in development mode
        debug_mode = os.environ.get('FLASK_ENV', '').lower() == 'development'
        
        if debug_mode:
            print("🔧 Development mode: Auto-reload enabled")
        else:
            print("🏭 Production mode: Auto-reload disabled")
            
        app.app.run(host='0.0.0.0', port=5000, debug=debug_mode, use_reloader=debug_mode)
    except Exception as e:
        print(f"💥 Flask app error: {e}")
        sys.exit(1)

def main():
    print("🐳 Container initialization starting...")
    print("=" * 50)
    
    # Step 1: Wait for database
    if not wait_for_database():
        print("❌ Cannot connect to database, exiting...")
        sys.exit(1)
    
    # Step 2: Run seeder if needed
    if not run_seeder_if_needed():
        print("❌ Seeding failed, exiting...")
        sys.exit(1)
    
    # Step 3: Start Flask app
    print("\n" + "=" * 50)
    print("🎉 Initialization complete, starting application...")
    start_flask_app()

if __name__ == "__main__":
    main()
