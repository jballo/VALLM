from flask import jsonify, request, make_response
from backend.api import bp
from backend.utils import verify_auth_header, calculate_relevancy_score 
from backend.extensions import groq_client, openai_client
from psycopg2 import pool, Error
from backend.config import Config
import groq
import os

connection_string = Config.DATABASE_URL

@bp.route('/users', methods=['POST'])
def create_user():
    try:
        header_api_key = request.headers.get("X-API-Key")
        auth_check = verify_auth_header(header_api_key)
        if auth_check != None:
            return auth_check
        
        user_id = request.args.get('id')
        user_username = request.args.get('username')
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
            # Execute SQL commands to retrieve the current time and version from PostgreSQL
            sql = "INSERT INTO Users (Id, Username) VALUES (%s, %s);"
            data = (user_id, user_username)
            cur.execute(sql, data)

        conn.close()
        print("Successfully created: ", user_username)
        
        response_body = {
            "status": "success",
            "code": 200,
            "content": "User has been created"
        }
        return make_response(jsonify(response_body), 200)
    except Error as e:
        print("Error created user. Error: ", e.pgerror)

        # Set the connection to 'None' in case of error
        conn = None
        
        response_body = {
            "status": "failure",
            "code": 500,
            "error": e.pgerror
        }
        return make_response(jsonify(response_body), 500)
    

@bp.route('/llm-response', methods=['POST'])
def llm_response():
    try:
        header_api_key = request.headers.get('X-API-Key')
        auth_check = verify_auth_header(header_api_key)
        if auth_check != None:
            return auth_check
        
        # Get the prompt from request
        prompt = request.args.get('text')
        contxt = request.args.get('context')
        print("Text: ", prompt)

        system_prompt = f"""
        I will provide you with information about a company's website, including sections like product pages, landing pages, FAQs, 'Contact Us,' pricing tables, testimonials, blogs, case studies, careers, company history, and more. Your task is to:

        1. Generate Contextual Understanding:

        Analyze the provided content to understand the company’s target audience, industry, and goals.

        Identify the purpose of each section and its role in serving user or customer needs.

        2. Answer Specific User Questions:

        Respond to user prompts by directly answering questions based on the provided website content.

        Provide clear, concise, and accurate answers that align with the information from the relevant section.

        Keep responses direct and straightforward, as users prefer concise answers for clarity and ease of use.

        Examples of user questions could include:

        "What is the return policy?"

        "How do I contact customer support?"

        "What features does this product offer?"

        "What job openings are currently available?"

        3. Ensure Information Clarity:

        Use structured and easy-to-understand language when providing answers.

        Refer explicitly to the provided sections for accuracy and detail.

        4. Provide Additional Context When Relevant:

        If user questions require more context, expand answers using information explicitly given in the input.

        Avoid assumptions or adding unsupported details beyond the provided content.

        Enhanced Example Inputs and Outputs

        Input 1: Product Page

        Description:The product page features the "SmartTech Backpack," highlighting:

        Weather-resistant material and anti-theft features.

        USB charging ports and multiple compartments.

        Pricing at $120 with options for monthly installments.

        A "Buy Now" button and a short customer review.

        Example User Question:

        "What is the price of the SmartTech Backpack?"

        Output:

        "The SmartTech Backpack is priced at $120. Monthly installment options are also available."

        Input 2: FAQ Page

        Description:FAQ categories include:

        Shipping: "Standard shipping takes 3–5 business days."

        Returns: "Items can be returned within 30 days for a full refund, provided they are unused and in original packaging."

        Warranty: "Products come with a 1-year warranty covering manufacturing defects."

        Example User Question:

        "What is the return policy?"

        Output:

        "Items can be returned within 30 days for a full refund, provided they are unused and in their original packaging."

        Input 3: Careers Page

        Description:The careers page lists job openings, benefits, and company culture. Current openings include:

        Software Engineer: Requires 3+ years of experience in full-stack development.

        Marketing Specialist: Requires 2+ years of experience in digital marketing.

        Example User Question:

        "What jobs are currently available?"

        Output:

        "The company is currently hiring for the following positions:

        Software Engineer: Requires 3+ years of experience in full-stack development.

        Marketing Specialist: Requires 2+ years of experience in digital marketing."

        Input 4: Contact Us Page

        Description:The page includes:

        Email: support@company.com

        Phone: +1 (800) 123-4567

        Live chat available from 9 AM to 5 PM EST.

        Example User Question:

        "How can I contact customer support?"

        Output:

        "You can contact customer support via email at support@company.com, by phone at +1 (800) 123-4567, or through live chat available from 9 AM to 5 PM EST.
        
        """

        llama_versatile_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
        )
        llama_instant_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.1-8b-instant",
        )
        mixtral_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="mixtral-8x7b-32768",
        )
        gpt_completion = openai_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
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
        # calculate_coherence_score(prompt, llama_versatile_response)
        # calculate_toxicity_score(prompt, llama_versatile_response)
        # calculate_bias_score(prompt, llama_versatile_response)
        # calculate_promp_alignment_score(system_prompt, llama_versatile_response)
        llama_versatile_relevancy_score = calculate_relevancy_score(prompt, llama_versatile_response)

        llama_instant_response = llama_instant_completion.choices[0].message.content
        print("llama-3.1-8b-instant Response: ", llama_instant_response, "\n\n\n")
        # calculate_coherence_score(prompt, llama_instant_response)
        # calculate_toxicity_score(prompt, llama_instant_response)
        # calculate_bias_score(prompt, llama_instant_response)
        # calculate_promp_alignment_score(system_prompt, llama_instant_response)
        llama_instant_relevancy_score = calculate_relevancy_score(prompt, llama_instant_response)

        mixtral_response = mixtral_completion.choices[0].message.content
        print("mixtral-8x7b-32768 Response: ", mixtral_response, "\n\n\n")
        # calculate_coherence_score(prompt, mixtral_response)
        # calculate_toxicity_score(prompt, mixtral_response)
        # calculate_bias_score(prompt, mixtral_response)
        # calculate_promp_alignment_score(system_prompt, mixtral_response)
        mixtral_relevancy_score = calculate_relevancy_score(prompt, mixtral_response)

        gpt_response = gpt_completion.choices[0].message.content
        print("gpt-4o-mini Response: ", gpt_response, "\n\n\n")
        # calculate_coherence_score(prompt, gpt_response)
        # calculate_toxicity_score(prompt, gpt_response)
        # calculate_bias_score(prompt, gpt_response)
        # calculate_promp_alignment_score(system_prompt, gpt_response)
        gpt_relevancy_score = calculate_relevancy_score(prompt, gpt_response)

        print("\n\n\n\n----------------------------\n\n")

        llm_responses = [
            {
                "llm_name": "llama-3.3-70b-versatile",
                "llm_response": llama_versatile_response,
                "llm_relevancy_score": llama_versatile_relevancy_score
            },
            {
                "llm_name": "llama-3.1-8b-instant",
                "llm_response": llama_instant_response,
                "llm_relevancy_score": llama_instant_relevancy_score
            },
            {
                "llm_name": "mixtral-8x7b-32768",
                "llm_response": mixtral_response,
                "llm_relevancy_score": mixtral_relevancy_score
            },
            {
                "llm_name": "gpt-4o-mini",
                "llm_response": gpt_response,
                "llm_relevancy_score": gpt_relevancy_score
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
