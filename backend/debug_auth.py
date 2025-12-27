from sqlmodel import Session, select
from database import engine
from models import User
from auth import verify_password

def debug_auth():
    session = Session(engine)
    user = session.exec(select(User).where(User.username == "admin_test")).first()
    
    if not user:
        print("User admin_test NOT FOUND in database.")
        return

    print(f"User found: {user.username}")
    print(f"Role: {user.role}")
    print(f"Hashed Password: {user.hashed_password}")
    
    is_valid = verify_password("password123", user.hashed_password)
    print(f"Password 'password123' valid? {is_valid}")

if __name__ == "__main__":
    debug_auth()
