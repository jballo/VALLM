from groq import Groq
from openai import OpenAI
from langchain_openai import OpenAIEmbeddings
from app.config import Config



groq_client = Groq(
    api_key=Config.GROQ_API_KEY
)

openai_client = OpenAI(
    api_key=Config.OPENAI_API_KEY
)

embedding_client = OpenAIEmbeddings(
    api_key=Config.OPENAI_API_KEY,
    model="text-embedding-3-small"
)

