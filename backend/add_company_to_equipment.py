"""
Add company column to Equipment table
"""
from sqlmodel import Session, text
from database import engine

def add_company_column():
    print("=" * 60)
    print("Adding company column to Equipment table")
    print("=" * 60)
    
    print(f"\nConnecting to database...")
    
    with engine.connect() as connection:
        # Check if column already exists
        result = connection.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='equipment' AND column_name='company';"))
        
        if result.fetchone():
            print("\n✓ Column 'company' already exists in 'equipment' table!")
        else:
            print("\n  Adding 'company' column to 'equipment' table...")
            connection.execute(text('ALTER TABLE equipment ADD COLUMN company VARCHAR;'))
            connection.commit()
            print("  ✓ Added 'company' column")
        
        print("\n" + "=" * 60)
        print("✓ Migration completed successfully!")
        print("=" * 60)
        

if __name__ == "__main__":
    add_company_column()
