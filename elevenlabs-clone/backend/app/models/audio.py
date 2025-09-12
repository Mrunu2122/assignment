from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AudioFile(BaseModel):
    language: str
    audio_url: str
    created_at: datetime = datetime.utcnow()

class AudioFileInDB(AudioFile):
    id: str

    class Config:
        from_attributes = True
