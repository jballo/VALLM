import os
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from psycopg2 import pool, Error
from dotenv import load_dotenv
import groq
from groq import Groq
from openai import OpenAI

# Load .env file
load_dotenv()
# Get the connection string from the environment variable
connection_string = os.getenv('DATABASE_URL')
api_key = os.getenv('API_KEY')
app = Flask(__name__)
CORS(app) 

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

openAi_client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)



@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

# Method to verify API key for authorization
def verify_auth_header(header_api_key):
        print("Testing authorization.")
        if (header_api_key != api_key):
            print("Unauthorized request")
            response_body = {
                 "status": "failed",
                 "code": 401,
                 "content": "Unauthorized request."
            }
            return make_response(jsonify(response_body), 401)
        else:
             print("Authorized request.")
             return None


@app.route("/user")
def createUser():
    try:
        # Check the API key in request headers for authentication
        header_api_key = request.headers.get("X-API-Key")
        auth_check = verify_auth_header(header_api_key)
        if auth_check != None:
            return auth_check

        user_id = request.args.get('id')
        user_username = request.args.get('username')
        connection_pool = pool.SimpleConnectionPool(
            1,  # Minimum number of connections in the pool
            10,  # Maximum number of connections in the pool
            connection_string
        )
        # Check if the pool was created successfully
        if connection_pool:
            print("Connection pool created successfully")
        # Get a connection from the pool
        conn = connection_pool.getconn()

        with conn:
            # Create a cursor object
            cur = conn.cursor()
            # Execute SQL commands to retrieve the current time and version from PostgreSQL
            sql = "INSERT INTO Users (Id, Username) VALUES (%s, %s);"
            data = (user_id, user_username,)
            cur.execute(sql, data)
            
        conn.close()    

        print("Succesfully created: ", user_username)

        
        # Return Error
        response_body = {
            "status": "success",
            "code": 200,
            "content": "User has been created"
        }
        return make_response(jsonify(response_body), 200)
    except Error as e:
        # pass exception to function
        print("Error creating user.  Error:", e.pgerror)
        # print_psycopg2_exception(err)

        # set the connection to 'None' in case of error
        conn = None
        # Return Error
        response_body = {
            "status": "failure",
            "code": 500,
            "error": e.pgerror
        }
        return make_response(jsonify(response_body), 500)


@app.route("/response", methods=['POST'])
def generate_response():
    # Verify the request is authenticated
    header_api_key = request.headers.get('X-API-Key')
    auth_check = verify_auth_header(header_api_key)
    if auth_check != None:
        return auth_check
    

    # Get the prompt from request
    prompt = request.args.get('text')
    print("Text: ", prompt)

    try :
        llama_versatile_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
        )

        llama_instant_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.1-8b-instant",
        )
        mixtral_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="mixtral-8x7b-32768",
        )

        gpt_completion = openAi_client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="gpt-4o-mini",
        )
        print("\n\n----------------------------\n\n\n\n")
        llama_versatile_response = llama_versatile_completion.choices[0].message.content
        print("llama-3.3-70b-versatile Response: ", llama_versatile_response, "\n\n\n")
        llama_instant_response = llama_instant_completion.choices[0].message.content
        print("llama-3.1-8b-instant Response: ", llama_instant_response, "\n\n\n")
        mixtral_response = mixtral_completion.choices[0].message.content
        print("mixtral-8x7b-32768 Response: ", mixtral_response, "\n\n\n")
        gpt_response = gpt_completion.choices[0].message.content
        print("gpt-4o-mini Response: ", gpt_response, "\n\n\n")
        print("\n\n\n\n----------------------------\n\n")

        llm_responses = [
            {
                "llm_name": "llama-3.3-70b-versatile",
                "llm_response": llama_versatile_response
            },
            {
                "llm_name": "llama-3.1-8b-instant",
                "llm_response": llama_instant_response
            },
            {
                "llm_name": "mixtral-8x7b-32768",
                "llm_response": mixtral_response
            },
            {
                "llm_name": "gpt-4o-mini",
                "llm_response": gpt_response
            },
        ]

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



