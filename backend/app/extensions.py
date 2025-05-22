from groq import Groq
from openai import OpenAI
from sentence_transformers import SentenceTransformer
from firecrawl import FirecrawlApp
from app.config import Config



groq_client = Groq(
    api_key=Config.GROQ_API_KEY
)

openai_client = OpenAI(
    api_key=Config.OPENAI_API_KEY
)

embedding_client = SentenceTransformer('all-MiniLM-L6-v2')
# embedding_client = SentenceTransformer("jinaai/jina-embeddings-v2-base-en", trust_remote_code=True)
# embedding_client.max_seq_length = 768
# embedding_client = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')


scraper = FirecrawlApp(
    api_key=Config.FIRECRAWL_KEY
)