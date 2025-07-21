#!/usr/bin/env python3
"""
Simple script to run the seeder with proper environment setup
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import and run seeder
from seeder import Seeder

def main():
    print("🚀 Initializing database seeder...")
    try:
        seeder = Seeder()
        success = seeder.run_full_seed()
        
        if success:
            print("\n✅ Seeder completed successfully!")
            sys.exit(0)
        else:
            print("\n❌ Seeder failed!")
            sys.exit(1)
            
    except Exception as e:
        print(f"\n💥 Seeder crashed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
