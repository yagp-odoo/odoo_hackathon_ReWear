from datetime import datetime, timedelta, timezone
from fastapi import *
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse, RedirectResponse
from pymongo import *
import os
from dotenv import load_dotenv
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
from jwt import JWT, jwk_from_dict
from typing import Optional, List
from bson import ObjectId
from schema import *
from starlette.requests import Request
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth, OAuthError
from jwt.exceptions import JWTDecodeError
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from authlib.integrations.starlette_client import OAuth, OAuthError
from uuid import uuid4

app = FastAPI(
    title="Product service"
)

# setup_middleware(app)
origins = [
    "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:3000",
]  

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
load_dotenv()

link = os.getenv("Database_Link")
client1 = MongoClient(link)
db1 = client1['SSRealEstate']
Secret_key = os.getenv("SECRET_KEY")
algorithm = os.getenv("ALGORITHM")
# Ensure indexes for fast search/filter
# db1.get_collection('Product').create_index([("name", "text")])
# db1.get_collection('Product').create_index("category")
# db1.get_collection('Product').create_index("price")
# db1.get_collection('Product').create_index("owner_id")


def decode_Access_token(token: str):
    try:
        jwt_instance = JWT()
        secret_key = jwk_from_dict({
            "k": Secret_key,
            "kty": "oct"
        })
        
        current_time = datetime.now(timezone.utc)    
        payload = jwt_instance.decode(token, secret_key, algorithms=[algorithm])
        
        exp = payload.get('exp')
        if exp:
            exp_time = datetime.fromtimestamp(exp, timezone.utc)
            if current_time > exp_time:
                raise HTTPException(status_code=401, detail="Token has expired")
        
        email: str = payload.get("email")
        role: str = payload.get("role")
        
        if email is None or role is None:
            raise HTTPException(status_code=401, detail="Invalid token data")
            
        token_data = {
            "email": email,
            "role": role
        }
        return token_data
        
    except JWTDecodeError as e:
        print(f"JWT decode error: {str(e)}")
        if "expired" in str(e).lower():
            raise HTTPException(status_code=401, detail="Token has expired")
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        print(f"Unexpected error in decode_Access_token: {str(e)}")
        raise HTTPException(status_code=401, detail=str(e))


@app.post("/product")
async def add_product(product: Product, request: Request):
    try:
        product_data = product.dict()
        # Set UUID as both id and _id
        if not product_data.get("id"):
            product_data["id"] = str(uuid4())
        product_data["_id"] = product_data["id"]

        # Attach owner from session cookie if present
        session = request.cookies.get('session')
        if session:
            try:
                user_data = decode_Access_token(session)
                product_data["owner_id"] = user_data.get("email")
            except Exception as e:
                print(f"Warning: could not decode token in add_product: {e}")

        # Normalize title and category for duplicate check
        normalized_title = product_data["title"].strip().lower()
        normalized_category = (product_data["category"].strip().lower() if product_data.get("category") else None)

        duplicate_query = {"title": normalized_title}
        if normalized_category:
            duplicate_query["category"] = normalized_category
        existing_product = db1.get_collection('Product').find_one(duplicate_query, {"_id": 0})
        if existing_product:
            raise HTTPException(status_code=400, detail="Product already exists")

        product_data["title"] = normalized_title
        if normalized_category:
            product_data["category"] = normalized_category

        db1.get_collection('Product').insert_one(product_data)
        return {"message": "Product added successfully", "product": product_data}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add product: {str(e)}")

@app.get("/product/{product_id}")
async def get_product(product_id: str):
    try:
        product = db1.get_collection('Product').find_one({"_id": product_id})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return JSONResponse(status_code=200, content=product)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/product/all")
async def get_all_products():
    try:
        products = db1.get_collection('Product').find()
        return JSONResponse(status_code=200, content=list(products))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/product/{product_id}")
async def update_product(product_id: str, product: Product):
    try:
        product_data = product.dict()
        product_data["_id"] = product_id
        product_data["id"] = product_id
        result = db1.get_collection('Product').update_one({"_id": product_id}, {"$set": product_data})
        return JSONResponse(status_code=200, content={"message": "Product updated successfully", "product_id": product_id})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/product/{product_id}")
async def delete_product(product_id: str):
    try:
        result = db1.get_collection('Product').delete_one({"_id": product_id})
        return JSONResponse(status_code=200, content={"message": "Product deleted successfully", "product_id": product_id})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/product/user/{user_id}")
async def get_products_by_user(user_id: str):
    try:
        products = db1.get_collection('Product').find({"owner_id": user_id})
        return JSONResponse(status_code=200, content=list(products))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/product/search")
async def search_products(
    title: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None
):
    try:
        query = {}
        if title:
            query["title"] = {"$regex": title, "$options": "i"}
        if category:
            query["category"] = category
        if min_price is not None or max_price is not None:
            query["price"] = {}
            if min_price is not None:
                query["price"]["$gte"] = min_price
            if max_price is not None:
                query["price"]["$lte"] = max_price
            if not query["price"]:
                del query["price"]
        products = db1.get_collection('Product').find(query)
        return JSONResponse(status_code=200, content=list(products))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)