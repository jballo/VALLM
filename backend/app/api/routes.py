from flask import jsonify, request, make_response, Response
from app.api import bp
from app.utils import verify_auth_header, deepeval_relevancy_score, generate_response
from app.extensions import groq_client, openai_client
import groq
from multiprocessing import Pool, Lock
import pprint
import json


# Initalize a lock
lock = Lock()

def process_llm_request(args):
    """Helper function to process LLM requests"""
    model, prompt, context = args
    return generate_response(model, prompt, context)

@bp.route('/llm-response', methods=['POST'])
def llm_response():
    try:
        header_api_key = request.headers.get('X-API-Key')
        auth_check = verify_auth_header(header_api_key)
        if auth_check != None:
            return auth_check
        
        data = request.get_json()
        prompt = data['text']
        contxt = data['retrieval_context']

        models_list = [
            ("llama-3.3-70b-versatile", prompt, contxt),
            ("llama-3.1-8b-instant", prompt, contxt),
            ("qwen-2.5-32b", prompt, contxt),
            ("gpt-4o-mini", prompt, contxt)
        ]

        def generate():
            with Pool(2) as p:
                results = p.map(process_llm_request, models_list)
                for result in results:
                    # print(result)
                    print("----------------------------")
                    pprint.pp(result)
                    print("----------------------------")
                    yield f"{json.dumps(result)}\n"
                # for result in results:
                #     with lock:
                #         pprint.pp(result)
                #         yield f"data: {json.dumps(result)}\n\n"


        return Response(
            generate(),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no', # Prevents buffering in Nginx
            }
        )
    
    except:
        response_body = {
            "status": "failure",
            "code": 500,
            "error": "Error produced"
        }

        return make_response(jsonify(response_body), 500)
    