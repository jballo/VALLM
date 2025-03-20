import os
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env

class Config:
    API_KEY = os.getenv('API_KEY')
    DATABASE_URL = os.getenv('DATABASE_URL')
    PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
    GROQ_API_KEY = os.getenv('GROQ_API_KEY')
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    BRIGHT_DATA_AUTH = os.getenv('BRIGHT_DATA_AUTH')
    SBR_SW_CDP = f'https://{BRIGHT_DATA_AUTH}@brd.superproxy.io:9222'
    CLERK_WEBHOOK_KEY=os.getenv('CLERK_WEBHOOK_KEY')
    

