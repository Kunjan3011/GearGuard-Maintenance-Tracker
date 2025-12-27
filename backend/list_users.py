from sqlmodel import Session, select
from database import engine, get_session
from models import User

def list_users():
    session = Session(engine)
    users = session.exec(select(User)).all()
    for u in users:
        print(f"ID: {u.id}, Username: {u.username}, Email: {u.email}, Role: {u.role}")

if __name__ == "__main__":
    list_users()
