from sqlmodel import Session, select
from database import engine, get_session
from models import User, Technician
from auth import get_password_hash

def create_users():
    session = Session(engine)
    
    users = [
        {"username": "admin_test", "email": "admin_test@gearguard.com", "password": "password123", "role": "admin"},
        {"username": "manager_test", "email": "manager@gearguard.com", "password": "password123", "role": "manager"},
        {"username": "tech_test", "email": "tech@gearguard.com", "password": "password123", "role": "technician"},
        {"username": "employee_test", "email": "employee@gearguard.com", "password": "password123", "role": "employee"},
    ]

    print("Creating test users...")
    for u in users:
        statement = select(User).where((User.username == u["username"]) | (User.email == u["email"]))
        existing_user = session.exec(statement).first()
        
        if not existing_user:
            user = User(
                username=u["username"],
                email=u["email"],
                hashed_password=get_password_hash(u["password"]),
                role=u["role"]
            )
            session.add(user)
            print(f"Created user: {u['username']} ({u['role']})")
        else:
            print(f"User {u['username']} already exists. Updating role and password...")
            existing_user.role = u["role"]
            existing_user.hashed_password = get_password_hash(u["password"])
            session.add(existing_user)
    
    session.commit()
    print("Done!")

if __name__ == "__main__":
    create_users()
