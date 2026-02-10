from flask import jsonify, request, make_response
from app.rag import bp
from app.utils import verify_auth_header
from app.extensions import embedding_client
from pinecone import Pinecone
from pinecone.exceptions import PineconeException
from app.config import Config
from langchain_text_splitters import RecursiveCharacterTextSplitter
import uuid
pinecone_api_key = Config.PINECONE_API_KEY


@bp.route("/embed", methods=['POST'])
def generate_embeddings():
    header_api_key = request.headers.get('X-API-Key')
    auth_check = verify_auth_header(header_api_key)
    if auth_check != None:
        return auth_check

    try:
        url = request.args.get('url')
        body = request.json
        # scraped content is expected to be a string of markdown
        scraped_content = body["content"]


        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1024,
            chunk_overlap=100,
            separators=["\n\n", "\n", ".", " ", ""]
        )

        chunks = splitter.split_text(scraped_content)

        # Initalize Pinecone
        pc = Pinecone(api_key=pinecone_api_key)

        # Connect to Pinecone index
        pinecone_index = pc.Index("llmeval")


        values = embedding_client.embed(texts=chunks, model="voyage-3-lite").embeddings

        vectors = []
        for sent_index, sent in enumerate(chunks):
            source = f"""{url} sentence #: {sent_index}"""
            nId = uuid.uuid4()
            oth = {
                "id": str(nId),
                "values": values[sent_index],
                "metadata": {
                    "text": sent,
                    "source": source,
                    "chunk_index": sent_index,
                    "total_chunks": len(chunks)
                }
            }
            vectors.append(oth)

        pinecone_index.upsert(vectors=vectors, namespace=url, batch_size=96, show_progress=False)


        return make_response("Successfully embedded content", 200)
    except (ValueError, TypeError) as e:
        print(f"[/api/v1/retrieval-augmented-generations/embed]: {e}")
        return make_response("Bad request", 400)
    except PineconeException as e:
        print(f"[api/v1/retrieval-augmented-generations/embed]: {e}")
        return make_response("Pinecone error", 500)
    except Exception as e:
        print(f"[api/v1/retrieval-augmented-generations/embed]: {e}")
        return make_response("Failed to create embeddings", 500)

@bp.route("", methods=['POST'])
def rag_retrieve():
    header_api_key = request.headers.get('X-API-Key')
    auth_check = verify_auth_header(header_api_key)
    if auth_check != None:
        return auth_check
    try:
        prompt = request.args.get('prompt')
        url = request.args.get('url')

        print("Prompt: ", prompt)
        print("Url: ", url)
        raw_query_embedding = embedding_client.embed(texts=prompt, model="voyage-3-lite").embeddings

        # Initalize Pinecone
        pc = Pinecone(api_key=pinecone_api_key)

        # Connect to Pinecone index
        pinecone_index = pc.Index("llmeval")

        top_matches = pinecone_index.query(vector=raw_query_embedding[0], top_k=3, include_metadata=True, namespace=url)

        contexts = [item['metadata']['text'] for item in top_matches['matches']]

        augmented_query = "<CONTEXT>\n" + "\n\n-----------\n\n".join(contexts[ : 10]) + "\n\n---------\n</CONTEXT>\n\n\n\nMY QUESTION:\n" + prompt

        rag_content = {
            "augmented_query": augmented_query,
            "retrieval_context": contexts
        }

        response_body = {
            "status": "success",
            "code": 200,
            "content": rag_content
        }

        return make_response(jsonify(response_body), 200)
    
    except Exception as err:
        print(f"Error for rag retrieval: {str(err)}")
        
        response_body = {
            "status": "failure",
            "error": f"Failed to rag retrieve {str(err)}"
        }
        
        return make_response(jsonify(response_body), 500)
