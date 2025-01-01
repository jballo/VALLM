import os
from flask import Flask, jsonify, request, make_response
from psycopg2 import pool, Error
from dotenv import load_dotenv


# Load .env file
load_dotenv()
# Get the connection string from the environment variable
connection_string = os.getenv('DATABASE_URL')
app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/user")
def createUser():
    try:
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

