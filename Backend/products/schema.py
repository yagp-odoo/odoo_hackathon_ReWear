from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from uuid import uuid4
from datetime import datetime

class Seller(BaseModel):
    name: str
    avatar: Optional[str] = None
    rating: Optional[float] = 0.0
    reviews: Optional[int] = 0
    joinDate: Optional[str] = None

class Measurements(BaseModel):
    chest: Optional[str] = None
    length: Optional[str] = None
    sleeves: Optional[str] = None

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    title: str
    description: Optional[str] = None
    price: float
    originalPrice: Optional[float] = None
    category: Optional[str] = None
    size: Optional[str] = None
    condition: Optional[str] = None
    points: Optional[int] = None
    owner: Optional[str] = None
    images: Optional[List[str]] = []
    owner_id: Optional[str] = None
    status: Optional[str] = "available"
    brand: Optional[str] = None
    color: Optional[str] = None
    material: Optional[str] = None
    measurements: Optional[Measurements] = None
    tags: Optional[List[str]] = []
    likes: Optional[int] = 0
    views: Optional[int] = 0
    postedDate: Optional[str] = None
    pointsRedemption: Optional[int] = 0
    seller: Optional[Seller] = None

class WishlistItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    user_id: str
    product_id: str
    added_at: datetime = Field(default_factory=datetime.now)
    product: Optional[Product] = None  # For populated wishlist items