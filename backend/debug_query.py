
from sqlmodel import select, Session
from database import engine
from models import MaintenanceRequest

def debug_query():
    print("Attempting to query MaintenanceRequest...")
    try:
        with Session(engine) as session:
            statement = select(MaintenanceRequest)
            results = session.exec(statement).all()
            print(f"Successfully retrieved {len(results)} requests.")
            for req in results:
                print(f" - {req.id}: {req.subject} (Company: {req.company})")
    except Exception as e:
        print(f"Query failed: {e}")

if __name__ == "__main__":
    debug_query()
