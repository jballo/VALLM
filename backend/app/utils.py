import json
from flask import make_response, jsonify
from app.extensions import groq_client
from app.config import Config
from deepeval import evaluate
from deepeval.metrics import ContextualRelevancyMetric
from deepeval.test_case import LLMTestCase
from deepeval.dataset import EvaluationDataset



api_key = Config.API_KEY

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
        
def calculate_relevancy_score(prompt, actual_output):
    # retrieval_context = retrieval_context.rstrip().split('\n')
    # metric = ContextualRelevancyMetric(
    #     threshold=0.7,
    #     model="gpt-4",
    #     include_reason=True
    # )
    # test_case = LLMTestCase(
    #     input="What if these shoes don't fit?",
    #     actual_output=actual_output,
    #     retrieval_context=retrieval_context
    # )

    # metric.measure(test_case)
    # print("Relevancy Score: ", metric.score)
    # print("Relevancy reason: ", metric.reason)

    system_prompt = f"""
    You are an evaluator tasked with determining whether the actual output directly answers the question or is relevant to the input prompt. Your goal is to analyze the input prompt and the actual output, and assign a numerical score between 0 and 10, where:

    - **0**: The output does not answer the question or is completely irrelevant to the input prompt.
    - **10**: The output fully answers the question and is highly relevant to the input prompt.

    Consider the following criteria in your evaluation:
    1. **Relevance:** Does the actual output relate to the context or topic of the input prompt?
    2. **Accuracy:** Does the output correctly and fully address the input prompt?

    Return your response in valid JSON format as follows:

    {{
    "relevancy_score": <score>
    }}

    Here is the information for evaluation:

    #### Input Prompt:
    {prompt}

    #### Actual Output:
    {actual_output}

    #### Response Format:
    {{
    "type": "json_object"
    }}

    Generate only the JSON object.
    """


    chat_completion = groq_client.chat.completions.create(
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
        response_format={ "type": "json_object" }
    )
    raw_response = chat_completion.choices[0].message.content
    # print(f"Raw Response: {raw_response}")

    parsed_response = json.loads(raw_response)
    score = parsed_response["relevancy_score"]
    # print(type(score))
    # print("Relevancy score: ", score)
    return score



def deepeval_relevancy_score (prompt, actual_output, retrieval_context):
    metric = ContextualRelevancyMetric(
        threshold=0.7,
        model="gpt-4o-mini",
        include_reason=True
    )

    test_cases_list = []
    for cntxt in retrieval_context:
        # temp = [cntxt]
        test_case = LLMTestCase(
            input=prompt,
            actual_output=actual_output,
            retrieval_context=[cntxt]
        )
        test_cases_list.append(test_case)
    print("test_cases_list: ", test_cases_list)
    print("\n\n\n\n----------- DEEPEVAL SCORES--------\n\n\n\n")

    result = evaluate(test_cases=test_cases_list, metrics=[metric], print_results=True, write_cache=False)
    print("result: ", len(result.test_results))
    score = 0
    for res in result.test_results:
        if res.success == True:
             score += 1

    success_rate = score / len(result.test_results)
    print("Success rate: ", success_rate)

    ("\n\n\n\n----------------------------------\n\n\n\n")
    return success_rate