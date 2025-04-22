"use client";

import { useEffect, useState } from "react";
import Header from "./header";
import PromptForm from "./promptform";
import LLMResponseComparison from "./llm-response-comparison";
import Sidebar from "./sidebar";
import { v4 as uuidv4 } from "uuid";

interface LLMResponse {
    llm_name: string,
    llm_response: string,
    contextual_relevancy_score: number,
    answer_relevancy_score: number,
    bias_success_score: number,
    toxicity_success_score: number,
    correctness_success_score: number,
}

interface TestCaseResult {
    id: string,
    prompt: string,
    expectedOutput: string,
    llm_response: LLMResponse[],
}

interface TestCase {
  id: string;
  prompt: string;
  expectedOutput: string;
}

interface CreateEmbeddingProp {
    createEmbedding: (
        url: string
    ) => Promise<{ success: boolean; response?: string; error?: string }>
}


interface DashboardProps {
  createEmbedding: CreateEmbeddingProp["createEmbedding"];
}



export default function Dashboard({ createEmbedding}: DashboardProps) {
    const [url, setUrl] = useState<string>("");
    const [testCases, setTestCases] = useState<TestCase[]>([]);
    const [currentTestCase, setCurrentTestCase] = useState<string>("");
    const [testCaseResults, setTestCaseResults] = useState<TestCaseResult[]>([]);

    const addTestCase = () => {
        const id = uuidv4();
        // setTestCases([...testCases, { id: id, prompt: "", expectedOutput: "" }]);
        setTestCases((prev) => [...prev, { id: id, prompt: "", expectedOutput: "" }]);
        // setTabVal(id);
        setCurrentTestCase(id);
    };

    const updateTestCase = (
        id: string,
        field: "prompt" | "expectedOutput",
        value: string
    ) => {
        setTestCases(
        testCases.map((tc) => (tc.id === id ? { ...tc, [field]: value } : tc))
        );
    };


    const handleSubmit = async () => {
        const validTestCases = testCases.filter(
        (tc) => tc.prompt.trim() && tc.expectedOutput.trim()
        );
        if (validTestCases.length > 0) {
            console.log("Valid test cases: ", validTestCases);
            // const id = uuidv4();
            // setTestCases([{ id: id, prompt: "", expectedOutput: "" }]);
            // setCurrentTestCase(id);


            await Promise.all(validTestCases.map(async (test) => {
                const response = await fetch(`/api/create-response`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'text/event-stream',
                    },
                    body: JSON.stringify({ 
                        text: test.prompt,
                        url: url,
                        expectedOutput: test.expectedOutput,
                     })
                });

                if (!response.ok){
                    console.log("Failed to generate llm response");
                }
                const res = await response.text();
                const arr = res.split('data: ');
                const validArr = arr.filter((item) => item.length > 0);
                // const res = await resonse.json();
                console.log("Res: ", res);
                console.log("arr: ", arr);
                console.log("Valid Arr: ", validArr);

                const llm_arr: LLMResponse[] = validArr.map((llm_res) => {
                    console.log("llm_res: ", llm_res);
                    const parsedItem = JSON.parse(llm_res);
                    return {
                        llm_name: parsedItem.llm_name,
                        llm_response: parsedItem.llm_response,
                        contextual_relevancy_score: parsedItem.contextual_relevancy_score,
                        answer_relevancy_score: parsedItem.answer_relevancy_score,
                        bias_success_score: parsedItem.bias_success_score,
                        toxicity_success_score: parsedItem.toxicity_success_score,
                        correctness_success_score: parsedItem.correctness_success_score,
                    }
                });

                const singleTestCaseRes = {
                    id: test.id,
                    prompt: test.prompt,
                    expectedOutput: test.expectedOutput,
                    llm_response: llm_arr,
                }

                setTestCaseResults((prev) => [...prev, singleTestCaseRes]);

                // const result: TestCaseResult = {
                //     id: test.id,
                //     prompt: test.prompt,
                //     expectedOutput: test.expectedOutput,
                //     llm_name: res.llm_name,
                //     llm_response: res.llm_response,
                //     contextual_relevancy_score: res.contextual_relevancy_score,
                //     answer_relevancy_score: res.answer_relevancy_score,
                //     bias_success_score: res.bias_success_score,
                //     toxicity_success_score: res.toxicity_success_score,
                //     correctness_success_score: res.correctness_success_score,
                // }

                // setTestCaseResults((prev) => [...prev, result]);

            }));

            // setTabVal(id);
        }
    };

    useEffect(() => {
        addTestCase();
    }, []);
    
    useEffect(() => {
        console.log("Test cases: ", testCases);
    }, [testCases]);

    useEffect(() => {
        console.log("Current test case: ", currentTestCase);
    }, [currentTestCase]);

    return (
        <div className="w-full min-h-screen p-12 flex flex-col gap-6">
              <Header />
              <div className="flex flex-row h-full">
                <Sidebar testCases={testCases} addTestCase={addTestCase} setCurrentTestCase={setCurrentTestCase}/>
                <div className="w-full">
                    <PromptForm createEmbedding={createEmbedding} url={url} setUrl={setUrl}/>
                    <LLMResponseComparison 
                        // url={url}
                        testCases={testCases}
                        currentTestCase={currentTestCase}
                        updateTestCase={updateTestCase}
                        handleSubmit={handleSubmit}
                        testCaseResults={testCaseResults}
                    />
                </div>
              </div>
        </div>
    );
}