from flask import jsonify, request, make_response
from app.api import bp
from app.utils import verify_auth_header, calculate_relevancy_score, deepeval_relevancy_score, generate_response
from app.extensions import groq_client, openai_client
import groq
from multiprocessing import Pool
import pprint


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
        

        with Pool(4) as p:
            llm_responses = p.starmap(generate_response, [("llama-3.3-70b-versatile", prompt, contxt), ("llama-3.1-8b-instant", prompt, contxt), ("qwen-qwq-32b", prompt, contxt), ("gpt-4o-mini", prompt, contxt)])

            pprint.pp(llm_responses)


            print("\n\n\n\n----------------------------\n\n")
            
            response_body = {
                "status": "success",
                "code": 200,
                "content": llm_responses
            }

            return jsonify(response_body)

    except groq.APIConnectionError as e:
        print("The server could not be reached")
        print(e.__cause__)  # an underlying Exception, likely raised within httpx.
        response_body = {
            "status": "success",
            "code": 500,
            "error": "Server could not be reached"
        }

        return make_response(jsonify(response_body), 500)
    
    except groq.RateLimitError as e:
        print("A 429 status code was received; we should back off a bit.")
        response_body = {
            "status": "success",
            "code": 429,
            "error": "Rate limit. Retry later."
        }

        return make_response(jsonify(response_body), 429)
    
    except groq.APIStatusError as e:
        print("Another non-200-range status code was received")
        print(e.status_code)
        print(e.response)
        response_body = {
            "status": "failure",
            "code": e.status_code,
            "error": e.response
        }

        return make_response(jsonify(response_body), 500)
