from flask import jsonify, request, make_response
from app.rag import bp
from app.utils import verify_auth_header
from app.extensions import embedding_client
from langchain_openai import OpenAIEmbeddings
from pinecone import Pinecone
from langchain.schema import Document
from langchain_pinecone import PineconeVectorStore
import os
from app.config import Config

pinecone_api_key = Config.PINECONE_API_KEY


@bp.route("/embed", methods=['POST'])
def generate_embeddings():
    print("/embed")
    header_api_key = request.headers.get('X-API-Key')
    auth_check = verify_auth_header(header_api_key)
    if auth_check != None:
        return auth_check
    
    url = request.args.get('url')
    content = request.json
    content_json = jsonify(content)
    print("Content: ", content)
    print("\n\n\nContent json: ", content_json)

    content_sentences = content.split(". ")

    print("Sentences: ")
    for sent in content_sentences:
        print(sent, "\n")
    pc = Pinecone(api_key=pinecone_api_key,)
    pinecone_index = pc.Index("llmeval")
    
    documents = []
    for sent_index, sent in enumerate(content_sentences):
        source = f"""{url} sentence #: {sent_index}"""
        doc = Document(
            page_content=sent,
            metadata={
                "source": source,
                "chunk_index": sent_index,
                "total_chunks": len(sent)
            }
        )
        documents.append(doc)

    vectorstore = PineconeVectorStore.from_documents(
        documents=documents,
        embedding=OpenAIEmbeddings(model="text-embedding-3-small"),
        index_name="llmeval",
        namespace=url
    )

    response_body = {
        "status": "success",
        "code": 200,
        "content": "Successfully embedded content from websites"
    }

    return make_response(jsonify(response_body), 200)

@bp.route("/", methods=['POST'])
def rag_retrieve():
    header_api_key = request.headers.get('X-API-Key')
    auth_check = verify_auth_header(header_api_key)
    if auth_check != None:
        return auth_check
    
    prompt = request.args.get('prompt')
    url = request.args.get('url')

    print("Prompt: ", prompt)
    print("Url: ", url)

    raw_query_embedding = embedding_client.embed_query(prompt)

    # Initalize Pinecone
    pc = Pinecone(api_key=pinecone_api_key)

    # Connect to Pinecone index
    pinecone_index = pc.Index("llmeval")

    # top_matches = pinecone_index.query(vector=raw_query_embedding.tolist(), top_k=5, include_metadata=True, namespace=url)
    top_matches = pinecone_index.query(vector=raw_query_embedding, top_k=5, include_metadata=True, namespace=url)
    

    print("\n\n\n-------------Matches--------------\n\n\n")
    print(top_matches)
    print("\n\n\n---------------------------------------\n\n\n")

    contexts = [item['metadata']['text'] for item in top_matches['matches']]

    print("\n\n\n-------------Contexts--------------\n\n\n")
    print(contexts)
    print("\n\n\n---------------------------------------\n\n\n")

    augmented_query = "<CONTEXT>\n" + "\n\n-----------\n\n".join(contexts[ : 10]) + "\n\n---------\n</CONTEXT>\n\n\n\nMY QUESTION:\n" + prompt

    print("\n\n\n-------------AUGMENTED QUERY--------------\n\n\n")
    print(augmented_query)
    print("\n\n\n---------------------------------------\n\n\n")

    rag_content = {
        "augmented_query": augmented_query,
        "retrieval_context": contexts
    }

    print("Rag content: ", rag_content)

    response_body = {
        "status": "success",
        "code": 200,
        "content": rag_content
    }

    return make_response(jsonify(response_body), 200)