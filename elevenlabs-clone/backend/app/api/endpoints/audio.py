from fastapi import APIRouter, HTTPException, Depends
from fastapi import Request
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter()

# Pydantic models for request/response
class AudioFileInDB(BaseModel):
    id: str
    _id: Optional[str] = None
    language: str
    audio_url: str
    created_at: str
    
    class Config:
        from_attributes = True
        populate_by_name = True
        json_encoders = {
            'ObjectId': str
        }
    
    @classmethod
    def from_mongo(cls, data: dict) -> 'AudioFileInDB':
        """Convert MongoDB document to AudioFileInDB"""
        if data.get('_id') and not data.get('id'):
            data['id'] = str(data['_id'])
        return cls(**data)

@router.get("/audio/{language}", response_model=AudioFileInDB)
async def get_audio_by_language(request: Request, language: str):
    """
    Get audio file URL by language
    """
    try:
        print(f"Looking up audio for language: {language}")
        db = request.app.db
        print(f"DB instance: {db}")
        
        audio = await db.find_one({"language": language.lower()})
        print(f"Found audio: {audio}")
        
        if not audio:
            raise HTTPException(status_code=404, detail=f"Audio not found for language: {language}")
            
        # Convert MongoDB document to AudioFileInDB
        audio_file = AudioFileInDB.from_mongo(audio)
        print(f"Returning audio file: {audio_file}")
        return audio_file
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Log the full error for debugging
        print(f"Error in get_audio_by_language: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/audio", response_model=List[AudioFileInDB])
async def list_audio_files(request: Request):
    """
    List all available audio files
    """
    try:
        print("Listing all audio files")
        db = request.app.db
        print(f"DB instance: {db}")
        
        audio_files = await db.find()
        print(f"Found {len(audio_files)} audio files")
        
        # Convert each audio file to AudioFileInDB to validate the response
        result = []
        for audio in audio_files:
            try:
                result.append(AudioFileInDB.from_mongo(audio))
            except Exception as e:
                print(f"Error processing audio file {audio}: {str(e)}")
                continue
                
        print(f"Returning {len(result)} valid audio files")
        return result
        
    except Exception as e:
        # Log the full error for debugging
        print(f"Error in list_audio_files: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
