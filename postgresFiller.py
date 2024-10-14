from dotenv import load_dotenv
import os
from faker import Faker
import psycopg2
from random import randint

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

def add_users():
    query = "INSERT INTO users (name, email, provider, image) VALUES (%s, %s, %s, %s)"
    for _ in range(20):
        name = fake.name()
        email = fake.email()
        provider = 'credentials' 
        image = fake.image_url()
        cursor.execute(query, (name, email, provider, image))
    connection.commit()


def add_chats():
    query = "INSERT INTO chats (creator_id) VALUES (%s)"
    for _ in range(20):
        creator_id = randint(26, 45)
        cursor.execute(query, (creator_id,))
    connection.commit()


def add_chat_participant():
    query = "INSERT INTO chat_participants (chat_id, user_id) VALUES (%s, %s)"
    cursor.execute(query, (4, 34))
    connection.commit()


cursor.close()
connection.close()
print("Data was added to db. Connection closed")