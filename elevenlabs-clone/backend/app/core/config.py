from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGO_DB: str = "elevenlabs_clone"
    
    # Add any other configuration variables here
    class Config:
        env_file = ".env"

settings = Settings()
