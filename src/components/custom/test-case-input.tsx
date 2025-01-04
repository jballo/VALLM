"use client"

import React, { useState } from 'react'

import { Plus, Trash2 } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

interface TestCase {
  id: string
  prompt: string
  expectedOutput: string
}

interface TestCaseInputProps {
  onSubmit: (testCases: TestCase[]) => void
}

export default function TestCaseInput({ onSubmit }: TestCaseInputProps){
  const [testCases, setTestCases] = useState<TestCase[]>([{ id: '1', prompt: '', expectedOutput: '' }])

  const addTestCase = () => {
    setTestCases([...testCases, { id: Date.now().toString(), prompt: '', expectedOutput: '' }])
  }

  const removeTestCase = (id: string) => {
    setTestCases(testCases.filter(tc => tc.id !== id))
  }

  const updateTestCase = (id: string, field: 'prompt' | 'expectedOutput', value: string) => {
    setTestCases(testCases.map(tc => tc.id === id ? { ...tc, [field]: value } : tc))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validTestCases = testCases.filter(tc => tc.prompt.trim() && tc.expectedOutput.trim())
    if (validTestCases.length > 0) {
      onSubmit(validTestCases)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {testCases.map((testCase, index) => (
        <Card key={testCase.id} className="p-4">
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Test Case {index + 1}</h3>
              {testCases.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTestCase(testCase.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor={`prompt-${testCase.id}`} className="block text-sm font-medium">
                Prompt
              </label>
              <Textarea
                id={`prompt-${testCase.id}`}
                value={testCase.prompt}
                onChange={(e) => updateTestCase(testCase.id, 'prompt', e.target.value)}
                placeholder="Enter your test case prompt here..."
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor={`expected-${testCase.id}`} className="block text-sm font-medium">
                Expected Output
              </label>
              <Textarea
                id={`expected-${testCase.id}`}
                value={testCase.expectedOutput}
                onChange={(e) => updateTestCase(testCase.id, 'expectedOutput', e.target.value)}
                placeholder="Enter the expected output here..."
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-between">
        <Button type="button" onClick={addTestCase} variant="outline">
          <Plus className="h-4 w-4 mr-2" /> Add Test Case
        </Button>
        <Button type="submit">
          Run Test Cases
        </Button>
      </div>
    </form>
  )
}

