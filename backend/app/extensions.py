from groq import Groq
from openai import OpenAI
from app.config import Config


groq_client = Groq(
    api_key=Config.GROQ_API_KEY
)

openai_client = OpenAI(
    api_key=Config.OPENAI_API_KEY
)

