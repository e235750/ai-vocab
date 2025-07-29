from fastapi import APIRouter

from .endpoints import words, wordbooks, bookmarks

api_router = APIRouter()

api_router.include_router(words.router, prefix="/words", tags=["words"])
api_router.include_router(wordbooks.router, prefix="/wordbooks", tags=["wordbooks"])
api_router.include_router(bookmarks.router, prefix="/bookmarks", tags=["bookmarks"])