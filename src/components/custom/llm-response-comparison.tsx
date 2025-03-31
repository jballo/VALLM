"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import TestCaseInput from './test-case-input'
import Results from './results'

interface TestCase {
  id: string
  prompt: string
  expectedOutput: string
}

interface LLMResponses {
    llm_name: string;
    llm_response: string;
    contextual_relevancy_score: number;
    answer_relevancy_score: number;
    bias_success_score: number;
    toxicity_success_score: number;
}

interface CreateResponseProps {
    createResponse: (
        text: string,
        url: string
    ) => Promise<{ success: boolean; response?: LLMResponses[]; error?: string;}>
    url: string
}


interface TestCaseResult {
  testCaseId: string
  prompt: string
  expectedOutput: string
  responses: LLMResponses[]
}

export default function LLMResponseComparison({createResponse, url}: CreateResponseProps) {
  const [testCaseResults, setTestCaseResults] = useState<TestCaseResult[]>([])

  const handleTestCaseSubmit = async (testCases: TestCase[]) => {
    const results = await Promise.all(testCases.map(async (testCase) => {
    //   const responses = await simulateLLMResponses(testCase.prompt,)
      const response = await createResponse(testCase.prompt, url);
      const responses = response.response || [];
      return {
        testCaseId: testCase.id,
        prompt: testCase.prompt,
        expectedOutput: testCase.expectedOutput,
        responses
      }
    }))
    setTestCaseResults(results);
  }

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
  )
}

