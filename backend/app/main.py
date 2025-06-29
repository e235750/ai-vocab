from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.router import api_router

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "AI Vocabulary Backend API"}

origins = [
    "http://frontend:3000",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api", tags=["api"])