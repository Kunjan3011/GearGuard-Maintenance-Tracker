"""
Add reset_token columns to User table
"""
from sqlmodel import Session
from database import engine
import psycopg2

def add_reset_token_columns():
    print("=" * 60)
    print("Adding reset_token columns to User table")
    print("=" * 60)
    
    # Get database connection details from engine URL
    url = str(engine.url)
    print(f"\nConnecting to database...")
    
    try:
        # Connect directly using psycopg2
        conn = psycopg2.connect(
            dbname="gearguard",
            host="localhost",
            port="5432"
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Check if columns already exist
        cursor.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='user' AND column_name='reset_token';
        """)
        
        if cursor.fetchone():
            print("\n✓ Column 'reset_token' already exists!")
        else:
            print("\n  Adding 'reset_token' column...")
            cursor.execute("""
                ALTER TABLE "user" 
                ADD COLUMN reset_token VARCHAR;
            """)
            print("  ✓ Added 'reset_token' column")
        
        # Check for reset_token_expires
        cursor.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='user' AND column_name='reset_token_expires';
        """)
        
        if cursor.fetchone():
            print("✓ Column 'reset_token_expires' already exists!")
        else:
            print("  Adding 'reset_token_expires' column...")
            cursor.execute("""
                ALTER TABLE "user" 
                ADD COLUMN reset_token_expires TIMESTAMP;
            """)
            print("  ✓ Added 'reset_token_expires' column")
        
        cursor.close()
        conn.close()
        
        print("\n" + "=" * 60)
        print("✓ Migration completed successfully!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        print("\nTrying to rollback...")

if __name__ == "__main__":
    add_reset_token_columns()
