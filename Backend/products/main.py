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
    "https://rewear-frontend.vercel.app",
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
algorithm = os.getenv("Algorithm")
# Ensure indexes for fast search/filter
# db1.get_collection('Product').create_index([("title", "text")])
# # db1.get_collection('Product').create_index("category")
# # db1.get_collection('Product').create_index("price")
# # db1.get_collection('Product').create_index("owner_id")
# db1.get_collection('Product').create_index("brand")
# db1.get_collection('Product').create_index("color")
# db1.get_collection('Product').create_index("size")
# db1.get_collection('Product').create_index("condition")

# Wishlist indexes
# db1.get_collection('Wishlist').create_index([("user_id", 1), ("product_id", 1)], unique=True)
# db1.get_collection('Wishlist').create_index("user_id")
# db1.get_collection('Wishlist').create_index("product_id")


def decode_Access_token(token: str):
    try:
        jwt_instance = JWT()
        secret_key = jwk_from_dict({
            "k": Secret_key,
            "kty": "oct"
        })
        
        current_time = datetime.now(timezone.utc)    
        payload = jwt_instance.decode(token, secret_key, algorithms={algorithm} if algorithm else {"HS256"})
        
        exp = payload.get('exp')
        if exp:
            exp_time = datetime.fromtimestamp(exp, timezone.utc)
            if current_time > exp_time:
                raise HTTPException(status_code=401, detail="Token has expired")
        
        email = payload.get("email")
        role = payload.get("role")
        
        if email is None or role is None:
            raise HTTPException(status_code=401, detail="Invalid token data")
            
        token_data = {
            "email": str(email),
            "role": str(role)
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

@app.get("/product/all")
async def get_all_products():
    try:
        products_cursor = db1.get_collection('Product').find()
        products = []
        for product in products_cursor:
            # Convert ObjectId to string for JSON serialization
            if "_id" in product:
                product["_id"] = str(product["_id"])
            products.append(product)
        return products
    except Exception as e:
        print(f"Get all products error: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Failed to fetch products: {str(e)}")
@app.get("/product/{product_id}")
async def get_product(product_id: str):
    try:
        product = db1.get_collection('Product').find_one({"_id": product_id})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Convert ObjectId to string for JSON serialization
        if "_id" in product:
            product["_id"] = str(product["_id"])
        
        return product
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Get product error: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Failed to fetch product: {str(e)}")

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
        products_cursor = db1.get_collection('Product').find({"owner_id": user_id})
        products = []
        for product in products_cursor:
            # Convert ObjectId to string for JSON serialization
            if "_id" in product:
                product["_id"] = str(product["_id"])
            products.append(product)
        return products
    except Exception as e:
        print(f"Get products by user error: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Failed to fetch user products: {str(e)}")

@app.get("/product/search")
async def search_products(
    title: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None
):
    try:
        query = {}
        
        # Handle title search with case-insensitive regex
        if title and title.strip():
            query["title"] = {"$regex": title.strip(), "$options": "i"}
        
        # Handle category search (case-insensitive)
        if category and category.strip() and category.lower() != "all":
            query["category"] = {"$regex": f"^{category.strip()}$", "$options": "i"}
        
        # Handle price range
        if min_price is not None or max_price is not None:
            query["price"] = {}
            if min_price is not None and min_price > 0:
                query["price"]["$gte"] = float(min_price)
            if max_price is not None and max_price > 0:
                query["price"]["$lte"] = float(max_price)
            
            # Remove empty price object
            if not query["price"]:
                del query["price"]
        
        print(f"Search query: {query}")  # Debug log
        
        # Execute the query
        products_cursor = db1.get_collection('Product').find(query)
        products = []
        
        for product in products_cursor:
            # Convert ObjectId to string for JSON serialization
            if "_id" in product:
                product["_id"] = str(product["_id"])
            products.append(product)
        
        print(f"Found {len(products)} products")  # Debug log
        
        return products
        
    except Exception as e:
        print(f"Search error: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@app.get("/product/advanced-search")
async def advanced_search_products(
    title: Optional[str] = None,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    color: Optional[str] = None,
    size: Optional[str] = None,
    condition: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    owner_id: Optional[str] = None
):
    """Advanced search with multiple filter options"""
    try:
        query = {}
        
        # Handle title search with case-insensitive regex
        if title and title.strip():
            query["title"] = {"$regex": title.strip(), "$options": "i"}
        
        # Handle category search (case-insensitive)
        if category and category.strip() and category.lower() != "all":
            query["category"] = {"$regex": f"^{category.strip()}$", "$options": "i"}
        
        # Handle brand search (case-insensitive)
        if brand and brand.strip() and brand.lower() != "all":
            query["brand"] = {"$regex": f"^{brand.strip()}$", "$options": "i"}
        
        # Handle color search (case-insensitive)
        if color and color.strip() and color.lower() != "all":
            query["color"] = {"$regex": f"^{color.strip()}$", "$options": "i"}
        
        # Handle size search (exact match)
        if size and size.strip() and size.lower() != "all":
            query["size"] = size.strip()
        
        # Handle condition search (exact match)
        if condition and condition.strip() and condition.lower() != "all":
            query["condition"] = condition.strip()
        
        # Handle owner search
        if owner_id and owner_id.strip():
            query["owner_id"] = owner_id.strip()
        
        # Handle price range
        if min_price is not None or max_price is not None:
            query["price"] = {}
            if min_price is not None and min_price > 0:
                query["price"]["$gte"] = float(min_price)
            if max_price is not None and max_price > 0:
                query["price"]["$lte"] = float(max_price)
            
            # Remove empty price object
            if not query["price"]:
                del query["price"]
        
        print(f"Advanced search query: {query}")  # Debug log
        
        # Execute the query
        products_cursor = db1.get_collection('Product').find(query)
        products = []
        
        for product in products_cursor:
            # Convert ObjectId to string for JSON serialization
            if "_id" in product:
                product["_id"] = str(product["_id"])
            products.append(product)
        
        print(f"Found {len(products)} products")  # Debug log
        
        return products
        
    except Exception as e:
        print(f"Advanced search error: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Advanced search failed: {str(e)}")

# Wishlist endpoints
@app.post("/wishlist/add")
async def add_to_wishlist(product_id: str, user_email: str):
    """Add a product to user's wishlist"""
    try:
        # Check if product exists
        product = db1.get_collection('Product').find_one({"_id": product_id})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Check if already in wishlist
        existing = db1.get_collection('Wishlist').find_one({
            "user_id": user_email,
            "product_id": product_id
        })
        
        if existing:
            raise HTTPException(status_code=400, detail="Product already in wishlist")
        
        # Add to wishlist
        wishlist_item = {
            "id": str(uuid4()),
            "user_id": user_email,
            "product_id": product_id,
            "added_at": datetime.now()
        }
        
        result = db1.get_collection('Wishlist').insert_one(wishlist_item)
        
        # Convert ObjectId to string for JSON serialization
        wishlist_item["_id"] = str(result.inserted_id)
        
        return {"message": "Product added to wishlist successfully", "wishlist_item": wishlist_item}
        
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Add to wishlist error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to add to wishlist: {str(e)}")

@app.delete("/wishlist/remove")
async def remove_from_wishlist(product_id: str, user_email: str):
    """Remove a product from user's wishlist"""
    try:
        # Remove from wishlist
        result = db1.get_collection('Wishlist').delete_one({
            "user_id": user_email,
            "product_id": product_id
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Product not found in wishlist")
        
        return {"message": "Product removed from wishlist successfully"}
        
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Remove from wishlist error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to remove from wishlist: {str(e)}")

@app.get("/wishlist")
async def get_user_wishlist(user_email: str):
    """Get user's wishlist with populated product details"""
    try:
        # Get wishlist items with product details
        pipeline = [
            {"$match": {"user_id": user_email}},
            {
                "$lookup": {
                    "from": "Product",
                    "localField": "product_id",
                    "foreignField": "_id",
                    "as": "product"
                }
            },
            {"$unwind": "$product"},
            {
                "$project": {
                    "id": 1,
                    "user_id": 1,
                    "product_id": 1,
                    "added_at": 1,
                    "product": 1
                }
            }
        ]
        
        wishlist_items = list(db1.get_collection('Wishlist').aggregate(pipeline))
        
        # Convert ObjectIds to strings
        for item in wishlist_items:
            if "_id" in item:
                item["_id"] = str(item["_id"])
            if "product" in item and "_id" in item["product"]:
                item["product"]["_id"] = str(item["product"]["_id"])
        
        return wishlist_items
        
    except Exception as e:
        print(f"Get wishlist error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get wishlist: {str(e)}")

@app.get("/wishlist/check/{product_id}")
async def check_wishlist_status(product_id: str, user_email: str):
    """Check if a product is in user's wishlist"""
    try:
        # Check if product is in wishlist
        wishlist_item = db1.get_collection('Wishlist').find_one({
            "user_id": user_email,
            "product_id": product_id
        })
        
        return {"in_wishlist": wishlist_item is not None}
        
    except Exception as e:
        print(f"Check wishlist status error: {str(e)}")
        return {"in_wishlist": False}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        db1.command('ping')
        return {"status": "healthy", "service": "product-service", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service unhealthy: {str(e)}")

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Product Service API", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)