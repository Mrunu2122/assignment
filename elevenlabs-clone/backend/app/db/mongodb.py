from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class MongoDB:
    client: AsyncIOMotorClient = None
    database = None

db = MongoDB()

async def connect_to_mongo():
    db.client = AsyncIOMotorClient(settings.MONGODB_URL)
    db.database = db.client[settings.MONGO_DB]

async def close_mongo_connection():
    if db.client:
        await db.client.close()

def get_database() -> AsyncIOMotorClient:
    return db.database
