"""
Check what users exist in the database
"""
from sqlmodel import Session, select
from database import engine
from models import User
from auth import verify_password

def check_users():
    print("=" * 60)
    print("Checking Users in Database")
    print("=" * 60)
    
    with Session(engine) as session:
        users = session.exec(select(User)).all()
        
        if not users:
            print("\n⚠ No users found in database!")
        else:
            print(f"\n✓ Found {len(users)} user(s):\n")
            for user in users:
                print(f"  ID: {user.id}")
                print(f"  Username: {user.username}")
                print(f"  Email: {user.email}")
                print(f"  Role: {user.role}")
                print(f"  Password Hash (first 50 chars): {user.hashed_password[:50]}...")
                
                # Test password verification
                try:
                    is_valid = verify_password("admin123", user.hashed_password)
                    print(f"  Password 'admin123' valid: {is_valid}")
                except Exception as e:
                    print(f"  Password verification error: {e}")
                print()
    
    print("=" * 60)

if __name__ == "__main__":
    check_users()
