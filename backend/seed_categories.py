from sqlmodel import Session, select
from models import EquipmentCategory
from database import engine

def seed_categories():
    with Session(engine) as session:
        if session.exec(select(EquipmentCategory)).first() is None:
            print("Seeding categories...")
            cat1 = EquipmentCategory(name="Computers", company="My Company (San Francisco)")
            cat2 = EquipmentCategory(name="Software", company="My Company (San Francisco)")
            cat3 = EquipmentCategory(name="Monitors", company="My Company (San Francisco)")
            session.add_all([cat1, cat2, cat3])
            session.commit()
            print("Done.")
        else:
            print("Categories already exist.")

if __name__ == "__main__":
    seed_categories()
