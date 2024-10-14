from dotenv import load_dotenv
import os
from faker import Faker
import psycopg2

load_dotenv()

connection = psycopg2.connect(
    host="localhost",
    port=os.getenv("DB_PORT"),
    database=os.getenv("DATABASE"),
    user=os.getenv("USER"),
    password=os.getenv("PASSWORD"),
)
cursor = connection.cursor()

fake = Faker()

cursor.execute("SELECT * FROM users;")
print(cursor.fetchall())


#connection.commit()


cursor.close()
connection.close()
#print("Data was added to db. Connection closed")