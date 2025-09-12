from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from gtts import gTTS
from io import BytesIO
from typing import Optional

app = FastAPI(title="Text-to-Speech API")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Language to gTTS language code mapping
LANGUAGE_MAP = {
    "english": "en",
    "arabic": "ar"
}

@app.get("/api/tts")
async def text_to_speech(
    text: str = Query(..., min_length=1, max_length=1000),
    lang: str = "english"
):
    """
    Convert text to speech and return the audio file.
    
    Args:
        text: The text to convert to speech
        lang: The language of the text (english or arabic)
    """
    try:
        # Validate language
        if lang not in LANGUAGE_MAP:
            raise HTTPException(status_code=400, detail=f"Unsupported language: {lang}")
        
        # Get language code
        lang_code = LANGUAGE_MAP[lang]
        
        # Generate TTS audio
        tts = gTTS(text=text, lang=lang_code, slow=False)
        
        # Save to bytes buffer
        audio_buffer = BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_bytes = audio_buffer.getvalue()
        
        # Return audio response
        return Response(
            content=audio_bytes,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "inline; filename=speech.mp3",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            }
        )
        
    except Exception as e:
        print(f"Error in TTS endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate speech")

@app.get("/api/languages")
async def get_supported_languages():
    """Get the list of supported languages"""
    return {"languages": list(LANGUAGE_MAP.keys())}

@app.get("/")
async def root():
    return {
        "message": "Welcome to Text-to-Speech API",
        "endpoints": {
            "text_to_speech": "/api/tts?text=your+text&lang=english",
            "languages": "/api/languages"
        }
    }
