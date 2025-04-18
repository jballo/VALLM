"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import TestCaseInput from "./test-case-input";
// import Results from "./results";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Stars, Zap } from "lucide-react";
import { Button } from "../ui/button";

interface TestCase {
  id: string
  prompt: string
  expectedOutput: string
}

interface CreateResponseProps {
  // url: string;
  testCases: TestCase[];
  currentTestCase: string;
  updateTestCase: (id: string,
        field: "prompt" | "expectedOutput",
        value: string) => void;
}

export default function LLMResponseComparison({ testCases, currentTestCase, updateTestCase }: CreateResponseProps) {
  // const [submittedTests, setSubmittedTests] = useState<TestCase[]>([]);
  const [resultTab, setResultTab] = useState<string>("");

  const onTabChange = (value: string) => {
    setResultTab(value);
  };

  useEffect(() => {
    if (resultTab.length > 0) {
      onTabChange(resultTab);
    }
  }, [resultTab]);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card className="bg-[#011627]">
        <CardHeader>
          <div className="flex flex-row justify-between">
            <Tabs defaultValue="editor">
              <TabsList className="bg-[#152838]">
                <TabsTrigger value="editor" className="data-[state=active]:bg-[#36c5b3] data-[state=active]:text-white"><Stars />Editor</TabsTrigger>
                <TabsTrigger value="results" className="data-[state=active]:bg-[#36c5b3] data-[state=active]:text-white"><Zap />Results</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant="ghost"
              className="text-white bg-[#36c5b3] hover:bg-[#278f81]"
            >
              Run Test{(testCases.length > 1) && (<>s ({testCases.length})</>)}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TestCaseInput
            // setSubmittedTests={setSubmittedTests}
            // setResultTab={setResultTab}
            testCases={testCases}
            currentTestCase={currentTestCase}
            updateTestCase={updateTestCase}
          />
        </CardContent>
      </Card>
      {/* {submittedTests.length > 0 && resultTab.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={resultTab} onValueChange={setResultTab}>
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
                />
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )} */}
    </div>
  );
}
