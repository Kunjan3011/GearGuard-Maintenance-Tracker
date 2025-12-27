from sqlmodel import create_engine, text
from database import DATABASE_URL

engine = create_engine(DATABASE_URL)

def add_category_id_column():
    with engine.connect() as connection:
        # Check if column exists
        try:
            connection.execute(text("ALTER TABLE equipment ADD COLUMN category_id INTEGER REFERENCES equipmentcategory(id)"))
            connection.commit()
            print("Added category_id column to equipment table.")
        except Exception as e:
            print(f"Error (column might already exist): {e}")

if __name__ == "__main__":
    add_category_id_column()
