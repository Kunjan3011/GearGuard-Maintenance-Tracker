"""
Add worksheet_notes column to MaintenanceRequest table
"""
from sqlmodel import Session, text
from database import engine

def add_worksheet_notes_column():
    print("=" * 60)
    print("Adding worksheet_notes column to MaintenanceRequest table")
    print("=" * 60)
    
    # Use SQLAlchemy engine to ensure we connect to the same DB as the app
    with engine.connect() as connection:
        # Check if column already exists
        result = connection.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='maintenancerequest' AND column_name='worksheet_notes';"))
        
        if result.fetchone():
            print("\n✓ Column 'worksheet_notes' already exists!")
        else:
            print("\n  Adding 'worksheet_notes' column...")
            connection.execute(text('ALTER TABLE maintenancerequest ADD COLUMN worksheet_notes TEXT;'))
            connection.commit()
            print("  ✓ Added 'worksheet_notes' column")
        
        print("\n" + "=" * 60)
        print("✓ Migration completed successfully!")
        print("=" * 60)

if __name__ == "__main__":
    add_worksheet_notes_column()
