"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import TestCaseInput from "./test-case-input";
import Results from "./results";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface TestCase {
  id: string;
  prompt: string;
  expectedOutput: string;
}

interface LLMResponses {
  llm_name: string;
  llm_response: string;
  llm_relevancy_score: number;
}

interface CreateResponseProps {
  createResponse: (
    text: string,
    url: string
  ) => Promise<{ success: boolean; response?: LLMResponses[]; error?: string }>;
  url: string;
}

// interface TestCaseResult {
//   testCaseId: string;
//   prompt: string;
//   expectedOutput: string;
//   responses: LLMResponses[];
// }

export default function LLMResponseComparison({
  createResponse,
  url,
}: CreateResponseProps) {
  // const [testCaseResults, setTestCaseResults] = useState<TestCaseResult[]>([]);
  const [submittedTests, setSubmittedTests] = useState<TestCase[]>([]);

  // const handleTestCaseSubmit = async (testCases: TestCase[]) => {
  //   setTestCaseResults([]);
  //   testCases.forEach(async (test) => {
  //     console.log("test: ", test);
  //     const response = await createResponse(test.prompt, url);
  //     const responses = response.response || [];

  //     const result = {
  //       testCaseId: test.id,
  //       prompt: test.prompt,
  //       expectedOutput: test.expectedOutput,
  //       responses,
  //     };

  //     setTestCaseResults((results) => [...results, result]);
  //   });
  // };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>LLM Response Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <TestCaseInput setSubmittedTests={setSubmittedTests} />
        </CardContent>
      </Card>
      {submittedTests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={submittedTests[0].id}>
              <TabsList>
                {submittedTests.map((test, index) => (
                  <TabsTrigger key={index} value={test.id}>
                    Result {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
              {submittedTests.map((test, index) => (
                <Results
                  key={test.id}
                  index={index}
                  url={url}
                  test={test}
                  createResponse={createResponse}
                />
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
