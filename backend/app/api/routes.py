from flask import jsonify, request, make_response, Response
from app.api import bp
from app.utils import verify_auth_header, generate_response
from app.extensions import groq_client, openai_client
from multiprocessing import Pool, Lock
import pprint
import json
# import time


# Initalize a lock
lock = Lock()

def process_llm_request(args):
    """Helper function to process LLM requests"""
    model, prompt, context, expected_output = args
    return generate_response(model, prompt, context, expected_output)

@bp.route('/llm-response', methods=['POST'])
def llm_response():
    try:
        header_api_key = request.headers.get('X-API-Key')
        auth_check = verify_auth_header(header_api_key)
        if auth_check != None:
            return auth_check
        
        data = request.get_json()
        prompt = data['text']
        models = data['models']
        contxt = data['retrieval_context']
        expected_output = data['expectedOutput']
        
        models_list = []

        for model in models:
            print("model: ", model)
            models_list.append((model, prompt, contxt, expected_output))

        def generate():
            with Pool(4) as p:
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
