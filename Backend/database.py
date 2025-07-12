from pymongo import MongoClient
from urllib.parse import quote_plus
import os
from dotenv import load_dotenv
load_dotenv()

mongo_uri = os.getenv("Database_link")

client1 = MongoClient(mongo_uri)
db1 = client1['SSRealEstate']
collection = db1.create_collection("User")
collection2= db1.create_collection("Product")
collection4 = db1.create_collection("Transaction")
collection6 = db1.create_collection("Wishlist")
print("Connection Succesfull")
