from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .core.firebase import initialize_firebase

from .api.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # アプリケーション起動時に実行
    print("アプリケーションを起動します...")
    initialize_firebase()
    yield
    # アプリケーション終了時に実行
    print("アプリケーションをシャットダウンします...")

app = FastAPI(lifespan=lifespan)

@app.get("/")
async def root():
    return {"message": "AI Vocabulary Backend API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Backend is running"}

origins = [
    "http://frontend:3000",
    "http://localhost:3000",
    "https://nginx:8080",
    "http://localhost:8080"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api", tags=["api"])