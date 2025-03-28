"use client"

import React, { useEffect, useState } from 'react'

import { Plus, Trash2 } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { v4 as uuidv4 } from 'uuid';

interface TestCase {
  id: string
  prompt: string
  expectedOutput: string
}

interface TestCaseInputProps {
  onSubmit: (testCases: TestCase[]) => void
}

export default function TestCaseInput({ onSubmit }: TestCaseInputProps){
  // const [testCases, setTestCases] = useState<TestCase[]>([{ id: '1', prompt: '', expectedOutput: '' }])
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [tabVal, setTabVal] = useState<string>("");

  const addTestCase = () => {
    // const id = Date.now().toString();
    const id = uuidv4();
    setTestCases([...testCases, { id: id, prompt: '', expectedOutput: '' }])
    setTabVal(id);
  }

  const removeTestCase = (id: string) => {
    setTestCases(testCases.filter(tc => tc.id !== id))
  }

  const updateTestCase = (id: string, field: 'prompt' | 'expectedOutput', value: string) => {
    setTestCases(testCases.map(tc => tc.id === id ? { ...tc, [field]: value } : tc))
  }

  const onTabChange = (value: string) => {
    setTabVal(value);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validTestCases = testCases.filter(tc => tc.prompt.trim() && tc.expectedOutput.trim())
    if (validTestCases.length > 0) {
      onSubmit(validTestCases)
    }
  }

  useEffect(() => {
    addTestCase();
  },[]);

  useEffect(() => {
    console.log("Test cases: ", testCases);
  }, [testCases]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={tabVal} onValueChange={setTabVal}>
        <TabsList>
          {testCases.map((test, index) => (
            <TabsTrigger key={test.id} value={test.id}>Test Case {index + 1}</TabsTrigger>
          ))}
        </TabsList>
        {testCases.map((test, index) => (
          <TabsContent key={test.id} value={test.id}>
            <Card>
              <CardContent className='p-4'>
                <div className="flex justify-between items-center">
                  <h3 className="tex-lg">Prompt:</h3>
                  {testCases.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        removeTestCase(test.id);
                        if ( index !== 0 ) {
                          onTabChange(testCases[0].id);
                        } else {
                          onTabChange(testCases[1].id);
                        }
                      }}
                    >
                      <Trash2 className='h-4 w-4 mr-2' /> Remove
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Textarea 
                    value={test.prompt}
                    onChange={(e) => updateTestCase(test.id, 'prompt', e.target.value)}
                    placeholder="Enter your test case prompt here..."
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg">Expected Output</h3>
                  <Textarea 
                    value={test.expectedOutput}
                    onChange={(e) => updateTestCase(test.id, 'expectedOutput', e.target.value)}
                    placeholder="Enter the expected output here..."
                    className='w-full'
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-between">
        <Button type="button" onClick={addTestCase} variant="outline">
          <Plus className="h-4 w-4 mr-2" /> Add Test Case
        </Button>
        <Button type="submit">
          Run Tests
        </Button>
      </div>
    </form>
  )
}

