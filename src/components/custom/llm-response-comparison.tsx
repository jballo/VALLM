"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import TextComparisonGrid from './text-comparison-grid'
import TestCaseInput from './test-case-input'

interface TestCase {
  id: string
  prompt: string
  expectedOutput: string
}

interface LLMResponses {
    llm_name: string;
    llm_response: string;
}

interface CreateResponseProps {
    createResponse: (
        text: string,
        url: string
    ) => Promise<{ success: boolean; responses?: LLMResponses[]; error?: string;}>
    url: string
}


interface TestCaseResult {
  testCaseId: string
  prompt: string
  expectedOutput: string
  responses: LLMResponses[]
}

// // This function simulates getting responses from different LLMs
// const simulateLLMResponses = async (prompt: string, url: string): Promise<LLMResponse[]> => {
//   // In a real scenario, you would call actual LLM APIs here
//   const llms = ['GPT-3', 'GPT-4', 'Claude', 'PALM']
//   const responses: LLMResponse[] = await Promise.all(
//     llms.map(async (llm) => {
//       const response = `This is a simulated response from ${llm} for the prompt: "${prompt}". In a real scenario, this would be the actual response from the LLM.`
//       const words = response.split(/\s+/)
//       return {
//         llmName: llm,
//         response,
//         stats: {
//           wordCount: words.length,
//           charCount: response.length,
//           uniqueWords: new Set(words.map(w => w.toLowerCase())).size
//         }
//       }
//     })
//   )
//   return responses
// }

export default function LLMResponseComparison({createResponse, url}: CreateResponseProps) {
  const [testCaseResults, setTestCaseResults] = useState<TestCaseResult[]>([])

  const handleTestCaseSubmit = async (testCases: TestCase[]) => {
    const results = await Promise.all(testCases.map(async (testCase) => {
    //   const responses = await simulateLLMResponses(testCase.prompt,)
      const response = await createResponse(testCase.prompt, url);
      const responses = response.responses || [];
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
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <TextComparisonGrid testCaseResults={testCaseResults} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

