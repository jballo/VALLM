from flask import jsonify, request, make_response
from app.websocket import bp
from app.utils import verify_auth_header
from app.config import Config
from psycopg2 import pool, Error
from svix.webhooks import Webhook, WebhookVerificationError


connection_string = Config.DATABASE_URL
clerk_webhook_secret = Config.CLERK_WEBHOOK_KEY


@bp.route('/users', methods=['POST'])
def create_user():
    headers = request.headers
    payload = request.get_data()

    try:
        wh = Webhook(clerk_webhook_secret)
        msg = wh.verify(payload, headers)

        data = request.get_json()
        user_id = data['data']['id']
        user_email = data['data']['email_addresses'][0]['email_address']

        print("User id: ", user_id)
        print("Email address: ", user_email)

        connection_pool = pool.SimpleConnectionPool(
            1, # Minimum number of connections in the pool
            10, # Maximum number of connections in the pool
            connection_string
        )
        # Checkif the pool was created successfully
        if connection_pool:
            print("Connection pool created successfully")

        # Get a connection form the pool
        conn = connection_pool.getconn()

        with conn:
            # Create a cursor object
            cur = conn.cursor()
            # Execute SQL command to create users table if not already created
            create_table_statement = "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL);"
            cur.execute(create_table_statement)

            # Execute SQL commands to retrieve the current time and version from PostgreSQL
            insert_user_statement = "INSERT INTO users (id, email) VALUES (%s, %s);"
            data = (user_id, user_email)
            cur.execute(insert_user_statement, data)

        conn.close()
        print("Successfully created: ", user_email)
        
        response_body = {
            "status": "success",
            "code": 200,
            "content": "User has been created"
        }
        return make_response(jsonify(response_body), 200)
    
    except Error as e:
        print("Error creating user. Error: ", e.pgerror)

        # Set the connection to 'None' in case of error
        conn = None

        response_body = {
            "status": "failure",
            "code": 500,
            "error": e.pgerror
        }

        return make_response(jsonify(response_body), 500)
    except WebhookVerificationError as e:
        print("Webhook Error: ", e)

        # Set the connection to 'None' in case of error
        conn = None

        response_body = {
            "status": "failure",
            "code": 500,
            "error": "Webhook error"
        }
        return make_response(jsonify(response_body), 500)