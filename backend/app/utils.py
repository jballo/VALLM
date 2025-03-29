import json
from flask import make_response, jsonify
from app.extensions import groq_client, openai_client
from app.config import Config
from deepeval import evaluate
from deepeval.metrics import ContextualRelevancyMetric
from deepeval.test_case import LLMTestCase
from deepeval.dataset import EvaluationDataset
import groq



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
        # include_reason=True
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
    # print("test_cases_list: ", test_cases_list)
    print("\n\n\n\n----------- DEEPEVAL SCORES--------\n\n\n\n")

    result = evaluate(
        test_cases=test_cases_list, 
        metrics=[metric], 
        # print_results=True, 
        write_cache=False
    )
    # print("result: ", len(result.test_results))
    score = 0
    for res in result.test_results:
        if res.success == True:
             score += 1

    success_rate = score / len(result.test_results)
    print("Success rate: ", success_rate)

    ("\n\n\n\n----------------------------------\n\n\n\n")
    return success_rate




def generate_response(model, prompt, context):

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

    try:

        print("\n\n\n\nmodel: ", model)
        model_name = model
        model_response = ""
        relevancy_score = 0



        if model == "llama-3.3-70b-versatile":
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
                max_tokens=60
            )

            llama_versatile_response = llama_versatile_completion.choices[0].message.content
            llama_versatile_relevancy_score = deepeval_relevancy_score(prompt, llama_versatile_response, context)

            model_response = llama_versatile_response
            relevancy_score = llama_versatile_relevancy_score
            # llama_versatile_relevancy_score = deepeval_relevancy_score(prompt, llama_versatile_response, contxt)
            # calculate_coherence_score(prompt, llama_versatile_response)
            # calculate_toxicity_score(prompt, llama_versatile_response)
            # calculate_bias_score(prompt, llama_versatile_response)
            # calculate_promp_alignment_score(system_prompt, llama_versatile_response)
        
        elif model == "llama-3.1-8b-instant":
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
                max_tokens=60
            )
            llama_instant_response = llama_instant_completion.choices[0].message.content
            llama_instant_relevancy_score = deepeval_relevancy_score(prompt, llama_instant_response, context)
            model_response = llama_instant_response
            relevancy_score = llama_instant_relevancy_score
        elif model == "qwen-qwq-32b":
            qwen_completion = groq_client.chat.completions.create(
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
                model="qwen-qwq-32b",
                # max_tokens=60
            )
            qwen_response = qwen_completion.choices[0].message.content
            qwen_relevancy_score = deepeval_relevancy_score(prompt, qwen_response, context)
            model_response = qwen_response
            relevancy_score = qwen_relevancy_score
        elif model == "qwen-2.5-32b":
            qwen_completion = groq_client.chat.completions.create(
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
                model="qwen-2.5-32b",
                # max_tokens=60
            )
            qwen_response = qwen_completion.choices[0].message.content
            qwen_relevancy_score = deepeval_relevancy_score(prompt, qwen_response, context)
            model_response = qwen_response
            relevancy_score = qwen_relevancy_score
        elif model == "gpt-4o-mini":
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
            gpt_response = gpt_completion.choices[0].message.content
            gpt_relevancy_score = deepeval_relevancy_score(prompt, gpt_response, context)
            model_response = gpt_response
            relevancy_score = gpt_relevancy_score
        else:
            model_name = ""
            model_response = "No response. Model unknown"
            relevancy_score = 0


        return {
            "llm_name": model_name,
            "llm_response": model_response,
            "llm_relevancy_score": relevancy_score,
        }
    
    except groq.APIConnectionError as e:
        print("The server could not be reached")
        print(e.__cause__)  # an underlying Exception, likely raised within httpx.
        return {
            "llm_name": model,
            "llm_response": "Server could not be reached.",
            "llm_relevancy_score": 0,
        }
    
    except groq.RateLimitError as e:
        print("A 429 status code was received; we should back off a bit.")
        return {
            "llm_name": model,
            "llm_response": "A 429 status code was received; we should back off a bit.",
            "llm_relevancy_score": 0,
        }
    
    except groq.APIStatusError as e:
        print("Another non-200-range status code was received")
        print(e.status_code)
        print(e.response)
        return {
            "llm_name": model,
            "llm_response": "Non-200-range status code was received",
            "llm_relevancy_score": 0,
        }
        
    
    