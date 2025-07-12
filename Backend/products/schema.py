from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import uuid4
class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    title: str
    description: Optional[str] = None
    price: float
    category: Optional[str] = None
    size: Optional[str] = None
    condition: Optional[str] = None
    points: Optional[int] = None
    owner: Optional[str] = None
    images: Optional[List[str]] = []
    owner_id: Optional[str] = None
    status: Optional[str] = "available"