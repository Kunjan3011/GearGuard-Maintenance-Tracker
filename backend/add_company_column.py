"""
Add company column to MaintenanceRequest table
"""
from sqlmodel import Session, text
from database import engine
import psycopg2

def add_company_column():
    print("=" * 60)
    print("Adding company column to MaintenanceRequest table")
    print("=" * 60)
    
    # Get database connection details from engine URL
    url = str(engine.url)
    print(f"\nConnecting to database...")
    
    # Use SQLAlchemy engine to ensure we connect to the same DB as the app
    with engine.connect() as connection:
        # Check if column already exists
        result = connection.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='maintenancerequest' AND column_name='company';"))
        
        if result.fetchone():
            print("\n✓ Column 'company' already exists!")
        else:
            print("\n  Adding 'company' column...")
            # We need to commit if using a transactional engine (though DDL is often auto-commit, engine level might wrap it)
            # For simple DDL, execute usually works, but we should wrap in transaction or set isolation level if needed.
            # However, simpler to just run the raw SQL.
            connection.execute(text('ALTER TABLE maintenancerequest ADD COLUMN company VARCHAR;'))
            connection.commit()
            print("  ✓ Added 'company' column")
        
        print("\n" + "=" * 60)
        print("✓ Migration completed successfully!")
        print("=" * 60)
        


if __name__ == "__main__":
    add_company_column()
