import os
# os.environ['DEEPEVAL_TELEMETRY_OPTOUT'] = 'YES'
# os.environ['DEEPEVAL_TELEMETRY_ENABLED'] = 'False'

import json
from flask import make_response, jsonify
from app.extensions import groq_client, openai_client
from app.config import Config
from deepeval import evaluate
from deepeval.metrics import ContextualRelevancyMetric
from deepeval.metrics import AnswerRelevancyMetric
from deepeval.metrics import BiasMetric
from deepeval.metrics import ToxicityMetric
from deepeval.test_case import LLMTestCase
from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCaseParams
from deepeval.dataset import EvaluationDataset
from deepeval.evaluate import CacheConfig, DisplayConfig
import groq
from deepeval.models import GeminiModel



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





def deepeval_relevancy_score (prompt, actual_output, retrieval_context, expected_output):
    model = GeminiModel(
        model_name="gemini-2.0-flash",
        api_key=Config.GEMINI_KEY,
    )

    context_relevancy_metric = ContextualRelevancyMetric(
        threshold=0.7,
        model=model,
        # include_reason=True
    )
    answer_relevancy_metric = AnswerRelevancyMetric(
        threshold=0.7,
        model=model,
        # include_reason=True
    )
    bias_metric = BiasMetric (
        threshold=0.5,
        model=model
    )

    toxicity_metric = ToxicityMetric(
        threshold=0.5,
        model=model
    )

    correctness_metric = GEval(
        name="Correctness",
        criteria="Determine whether the actual output is factually correct based on the expected output.",
        # NOTE: you can only provide either criteria or evaluation_steps, and not both
        evaluation_steps=[
            "Check whether the facts in 'actual output' contradicts any facts in 'expected output'",
            "You should also heavily penalize omission of detail",
            "Vague language, or contradicting OPINIONS, are OK"
        ],
        evaluation_params=[LLMTestCaseParams.INPUT, LLMTestCaseParams.ACTUAL_OUTPUT, LLMTestCaseParams.EXPECTED_OUTPUT],
        model=model
    )

    test_case = LLMTestCase(
        input=prompt,
        actual_output=actual_output,
        expected_output=expected_output,
        retrieval_context=retrieval_context  # Pass all contexts as a single list
    )


    test_cases_list = [test_case]

    result = evaluate(
        test_cases=test_cases_list, 
        metrics=[context_relevancy_metric, answer_relevancy_metric, bias_metric, toxicity_metric, correctness_metric],
        cache_config=CacheConfig(
            write_cache=False,
            use_cache=False
        ),
        display_config=DisplayConfig(
            print_results=False
        )
    )
    # print("result: ", result.test_results)
    contextual_results = []
    answer_results = []
    bias_results = []
    toxicity_results = []
    correctness_results = []

    for res in result.test_results:
        for metric in res.metrics_data:
            print("Metric: ", metric)
            if metric.name == "Contextual Relevancy":
                contextual_results.append(metric.score)
            elif metric.name == "Answer Relevancy":
                answer_results.append(metric.score)
            elif metric.name == "Bias":
                bias_results.append(metric.score)
            elif metric.name == "Toxicity":
                toxicity_results.append(metric.score)
            elif metric.name == "Correctness (GEval)":
                correctness_results.append(metric.score)
                
    contextual_score = sum(contextual_results) / len(contextual_results) if contextual_results else 0
    answer_score = sum(answer_results) / len(answer_results) if answer_results else 0
    bias_score = sum(bias_results) / len(bias_results) if bias_results else 0
    toxicity_score = sum(toxicity_results) / len(toxicity_results) if toxicity_results else 0
    correctness_score = sum(correctness_results) / len(correctness_results) if correctness_results else 0

    print("Contextual relevancy success rate: ", contextual_score)
    print("Answer relevancy success rate: ", answer_score)
    print("Bias success rate: ", bias_score)
    print("Toxicit succcess rate: ", toxicity_score)
    print("Correctness success rate: ", correctness_score)

    ("\n\n\n\n----------------------------------\n\n\n\n")
    return {
        "contextual_success_rate": contextual_score,
        "answer_success_rate": answer_score,
        "bias_success_rate": bias_score,
        "toxicity_success_rate": toxicity_score,
        "correctness_success_rate": correctness_score,
    }




def generate_response(model, prompt, context, expected_output):
    """Generate response from LLM"""
    print("Generating response...")

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
        contextual_relevancy_score = 0
        answer_relevancy_score = 0
        bias_success_score = 0
        toxicity_success_score = 0
        correctness_success_score = 0



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
            llama_versatile_relevancy_scores = deepeval_relevancy_score(prompt, llama_versatile_response, context, expected_output)

            model_response = llama_versatile_response
            contextual_relevancy_score = llama_versatile_relevancy_scores["contextual_success_rate"]
            answer_relevancy_score = llama_versatile_relevancy_scores["answer_success_rate"]
            bias_success_score = llama_versatile_relevancy_scores["bias_success_rate"]
            toxicity_success_score = llama_versatile_relevancy_scores["toxicity_success_rate"]
            correctness_success_score = llama_versatile_relevancy_scores["correctness_success_rate"]

        
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
            llama_instant_relevancy_scores = deepeval_relevancy_score(prompt, llama_instant_response, context, expected_output)
            print("llama_instant_relevancy_scores: ", llama_instant_relevancy_scores)
            model_response = llama_instant_response
            contextual_relevancy_score = llama_instant_relevancy_scores["contextual_success_rate"]
            answer_relevancy_score = llama_instant_relevancy_scores["answer_success_rate"]
            bias_success_score = llama_instant_relevancy_scores["bias_success_rate"]
            toxicity_success_score = llama_instant_relevancy_scores["toxicity_success_rate"]
            correctness_success_score = llama_instant_relevancy_scores["correctness_success_rate"]

        elif model == "mistral-saba-24b":
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
                model="mistral-saba-24b",
                # max_tokens=60
            )
            qwen_response = qwen_completion.choices[0].message.content
            qwen_relevancy_scores = deepeval_relevancy_score(prompt, qwen_response, context, expected_output)
            model_response = qwen_response
            contextual_relevancy_score = qwen_relevancy_scores["contextual_success_rate"]
            answer_relevancy_score = qwen_relevancy_scores["answer_success_rate"]
            bias_success_score = qwen_relevancy_scores["bias_success_rate"]
            toxicity_success_score = qwen_relevancy_scores["toxicity_success_rate"]
            correctness_success_score = qwen_relevancy_scores["correctness_success_rate"]

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
            qwen_relevancy_scores = deepeval_relevancy_score(prompt, qwen_response, context, expected_output)
            model_response = qwen_response
            contextual_relevancy_score = qwen_relevancy_scores["contextual_success_rate"]
            answer_relevancy_score = qwen_relevancy_scores["answer_success_rate"]
            bias_success_score = qwen_relevancy_scores["bias_success_rate"]
            toxicity_success_score = qwen_relevancy_scores["toxicity_success_rate"]
            correctness_success_score = qwen_relevancy_scores["correctness_success_rate"]

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
                max_tokens=60
            )
            gpt_response = gpt_completion.choices[0].message.content
            gpt_relevancy_scores = deepeval_relevancy_score(prompt, gpt_response, context, expected_output)
            model_response = gpt_response
            contextual_relevancy_score = gpt_relevancy_scores["contextual_success_rate"]
            answer_relevancy_score = gpt_relevancy_scores["answer_success_rate"]
            bias_success_score = gpt_relevancy_scores["bias_success_rate"]
            toxicity_success_score = gpt_relevancy_scores["toxicity_success_rate"]
            correctness_success_score = gpt_relevancy_scores["correctness_success_rate"]

        else:
            model_name = ""
            model_response = "No response. Model unknown"
            contextual_relevancy_score = 0
            answer_relevancy_score = 0
            bias_success_score = 0
            toxicity_success_score = 0
            correctness_success_score = 0


        return {
            "llm_name": model_name,
            "llm_response": model_response,
            "contextual_relevancy_score": contextual_relevancy_score,
            "answer_relevancy_score": answer_relevancy_score,
            "bias_success_score": bias_success_score,
            "toxicity_success_score": toxicity_success_score,
            "correctness_success_score": correctness_success_score,
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
        
    
    