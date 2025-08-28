from fastapi import APIRouter


from .endpoints import words, wordbooks, bookmarks, users, user_settings

api_router = APIRouter()

api_router.include_router(words.router, prefix="/words", tags=["words"])
api_router.include_router(wordbooks.router, prefix="/wordbooks", tags=["wordbooks"])
api_router.include_router(bookmarks.router, prefix="/bookmarks", tags=["bookmarks"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(user_settings.router, prefix="/user-settings", tags=["user-settings"])