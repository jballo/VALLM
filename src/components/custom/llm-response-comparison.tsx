"use client";

import React, { useEffect, useState } from "react";
import TestCaseInput from "./test-case-input";
// import Results from "./results";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Stars, Zap } from "lucide-react";
import { Button } from "../ui/button";

interface ModelChoice {
  model: string;
  selected: boolean;
}

interface TestCase {
  id: string;
  prompt: string;
  expectedOutput: string;
  models: ModelChoice[];
}

interface LLMResponse {
  llm_name: string;
  llm_response: string;
  contextual_relevancy_score: number;
  answer_relevancy_score: number;
  bias_success_score: number;
  toxicity_success_score: number;
  correctness_success_score: number;
}

interface TestCaseResult {
  id: string;
  prompt: string;
  expectedOutput: string;
  llm_response: LLMResponse[];
}

interface CreateResponseProps {
  // url: string;
  testCases: TestCase[];
  currentTestCase: string;
  updateTestCase: (
    id: string,
    field: "prompt" | "expectedOutput",
    value: string
  ) => void;
  handleSubmit: () => void;
  testCaseResults: TestCaseResult[];
  setTestCases: (newTest: TestCase[]) => void;
}

export default function LLMResponseComparison({
  testCases,
  currentTestCase,
  updateTestCase,
  handleSubmit,
  testCaseResults,
  setTestCases,
}: CreateResponseProps) {
  // const [submittedTests, setSubmittedTests] = useState<TestCase[]>([]);
  const [resultTab, setResultTab] = useState<string>("");
  // const [results, setResults] = useState<LLMResponses[]>([]);

  const onTabChange = (value: string) => {
    setResultTab(value);
  };

  useEffect(() => {
    if (resultTab.length > 0) {
      onTabChange(resultTab);
    }
  }, [resultTab]);

  useEffect(() => {
    console.log("Test Case Results: ", testCaseResults);
  }, [testCaseResults]);

  return (
    <div className=" w-full p-2">
      <div className="bg-[#011627] rounded-3xl">
        <div className="flex flex-row w-full justify-between">
          <Tabs defaultValue="editor" className="w-full">
            <div className="flex flex-row justify-between w-full px-2.5 pt-3.5">
              <TabsList className="bg-[#152838]">
                <TabsTrigger
                  value="editor"
                  className="data-[state=active]:bg-[#36c5b3] data-[state=active]:text-white"
                >
                  <Stars />
                  Editor
                </TabsTrigger>
                <TabsTrigger
                  value="results"
                  className="data-[state=active]:bg-[#36c5b3] data-[state=active]:text-white"
                >
                  <Zap />
                  Results
                </TabsTrigger>
              </TabsList>
              <Button
                variant="ghost"
                className="text-white bg-[#36c5b3] hover:bg-[#278f81] "
                onClick={handleSubmit}
              >
                Run Test{testCases.length > 1 && <>s ({testCases.length})</>}
              </Button>
            </div>
            <TabsContent value="editor" className="w-full">
              <TestCaseInput
                // setSubmittedTests={setSubmittedTests}
                // setResultTab={setResultTab}
                testCases={testCases}
                currentTestCase={currentTestCase}
                updateTestCase={updateTestCase}
                setTestCases={setTestCases}
              />
            </TabsContent>
            <TabsContent value="results" className="text-white">
              <div className="w-full flex flex-col p-4 gap-5">
                {testCaseResults.filter((test) => test.id === currentTestCase)
                  .length === 1 ? (
                  <>
                    Results computed
                    <div>
                      <p>
                        Prompt:{" "}
                        {
                          testCaseResults.filter(
                            (test) => test.id === currentTestCase
                          )[0].prompt
                        }
                      </p>
                      <p>
                        Expected Output:{" "}
                        {
                          testCaseResults.filter(
                            (test) => test.id === currentTestCase
                          )[0].expectedOutput
                        }
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {testCaseResults
                        .filter((test) => test.id === currentTestCase)[0]
                        .llm_response.map((llm_res, index) => (
                          <div key={index}>
                            <p>Name: {llm_res.llm_name}</p>
                            <p>Llm Response: {llm_res.llm_response}</p>
                            <p>
                              Contextual Relevancy Score:{" "}
                              {llm_res.contextual_relevancy_score}
                            </p>
                            <p>
                              Answer Relevancy Score:{" "}
                              {llm_res.answer_relevancy_score}
                            </p>
                            <p>Bias Score: {llm_res.bias_success_score}</p>
                            <p>
                              Toxicity Score: {llm_res.toxicity_success_score}
                            </p>
                            <p>
                              Correctness Score:{" "}
                              {llm_res.correctness_success_score}
                            </p>
                          </div>
                        ))}
                    </div>
                  </>
                ) : (
                  <>
                    <h2>No Results Yet</h2>
                    <p>Run tests to see results for this test case</p>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
          {/* <Button
              variant="ghost"
              className="text-white bg-[#36c5b3] hover:bg-[#278f81] "
              onClick={handleSubmit}
            >
              Run Test{(testCases.length > 1) && (<>s ({testCases.length})</>)}
            </Button> */}
        </div>
      </div>
    </div>
  );
}
