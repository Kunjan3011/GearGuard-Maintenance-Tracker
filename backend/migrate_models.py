from sqlmodel import text, Session
from database import engine

def migrate_db():
    print("Migrating database...")
    with Session(engine) as session:
        try:
            session.exec(text("ALTER TABLE maintenancerequest ALTER COLUMN technician_id DROP NOT NULL;"))
            session.exec(text("ALTER TABLE maintenancerequest ALTER COLUMN team_id DROP NOT NULL;"))
            session.commit()
            print("Migration successful: technician_id and team_id are now nullable.")
        except Exception as e:
            print(f"Migration failed: {e}")
            session.rollback()

if __name__ == "__main__":
    migrate_db()
