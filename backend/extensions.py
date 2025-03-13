from groq import Groq
from openai import OpenAI
from backend.config import Config


groq_client = Groq(
    api_key=Config.GROQ_API_KEY
)

openai_client = OpenAI(
    api_key=Config.OPENAI_API_KEY
)

