"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import TestCaseInput from "./test-case-input";
import Results from "./results";

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

interface TestCaseResult {
  testCaseId: string;
  prompt: string;
  expectedOutput: string;
  responses: LLMResponses[];
}

export default function LLMResponseComparison({
  createResponse,
  url,
}: CreateResponseProps) {
  const [testCaseResults, setTestCaseResults] = useState<TestCaseResult[]>([]);

  const handleTestCaseSubmit = async (testCases: TestCase[]) => {
    setTestCaseResults([]);
    testCases.forEach(async (test) => {
      console.log("test: ", test);
      const response = await createResponse(test.prompt, url);
      const responses = response.response || [];

      const result = {
        testCaseId: test.id,
        prompt: test.prompt,
        expectedOutput: test.expectedOutput,
        responses,
      };
      // const tempArr = [...testCaseResults, result];
      // console.log("TempArr: ", tempArr);

      setTestCaseResults((results) => [...results, result]);
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>LLM Response Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <TestCaseInput onSubmit={handleTestCaseSubmit} />
        </CardContent>
      </Card>

      {testCaseResults.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Results testCaseResults={testCaseResults} />
              {/* <TextComparisonGrid testCaseResults={testCaseResults} /> */}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
