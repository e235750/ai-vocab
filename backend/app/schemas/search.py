from pydantic import BaseModel
from typing import Optional, List
from .wordbooks import WordBookResponse

class SearchQuery(BaseModel):
    q: Optional[str] = None
    is_public: Optional[bool] = None
    is_owned: Optional[bool] = None
    min_words: Optional[int] = None
    sort_by: Optional[str] = "created_at"
    sort_order: Optional[str] = "desc"
    page: Optional[int] = 1
    limit: Optional[int] = 20

class SearchResponse(BaseModel):
    wordbooks: List[WordBookResponse]
    total: int
    page: int
    total_pages: int
    has_next: bool
    has_prev: bool
    query: str
