"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface LLMResponses {
    llm_name: string;
    llm_response: string;
    llm_relevancy_score: number;
}

interface TestCaseResult {
  testCaseId: string
  prompt: string
  expectedOutput: string
  responses: LLMResponses[]
}

interface ResponseCardProps {
  item: LLMResponses
  isActive: boolean
  onClick: () => void
}



export function ResponseCard({ item, isActive, onClick }: ResponseCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{item.llm_name}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClick}>
          {isActive ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Relevancy Score: {item.llm_relevancy_score}</span>
        </div>
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="text-sm mt-2">{item.llm_response}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

interface TextComparisonGridProps {
  testCaseResults: TestCaseResult[]
}

export default function TextComparisonGrid({ testCaseResults }: TextComparisonGridProps) {
  const [activeIndices, setActiveIndices] = useState<{ [key: string]: number | null }>({})

  const handleCardClick = (testCaseId: string, index: number) => {
    setActiveIndices(prev => ({
      ...prev,
      [testCaseId]: prev[testCaseId] === index ? null : index
    }))
  }

  return (
    <div className="space-y-8">
      {testCaseResults.map((testCaseResult, testCaseIndex) => (
        <Card key={testCaseResult.testCaseId} className="p-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Test Case {testCaseIndex + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Prompt:</h3>
              <p className="text-sm bg-muted p-2 rounded">{testCaseResult.prompt}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Expected Output:</h3>
              <p className="text-sm bg-muted p-2 rounded">{testCaseResult.expectedOutput}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">LLM Responses:</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {testCaseResult.responses.map((item, index) => (
                  <ResponseCard
                    key={index}
                    item={item}
                    isActive={activeIndices[testCaseResult.testCaseId] === index}
                    onClick={() => handleCardClick(testCaseResult.testCaseId, index)}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

