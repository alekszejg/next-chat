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
        creator_id = randint(47, 60)
        cursor.execute(query, (creator_id,))
    connection.commit()


def add_chat_participant():
    query = "INSERT INTO chat_participants (chat_id, user_id) VALUES (%s, %s)"
    cursor.execute(query, (48, 51))
    connection.commit()

# just add both pairs for quicker test
def friendship_request(user_id, contact_id): 
    query = "INSERT INTO contacts (user_id, contact_id) VALUES (%s, %s)"
    cursor.execute(query, (user_id, contact_id))
    cursor.execute(query, (contact_id, user_id))
    connection.commit()


friendship_request(47, 68)
cursor.close()
connection.close()
print("Data was added to db. Connection closed")