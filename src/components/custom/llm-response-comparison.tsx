"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import TestCaseInput from "./test-case-input";
// import Results from "./results";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Stars, Zap } from "lucide-react";
import { Button } from "../ui/button";

interface TestCase {
  id: string
  prompt: string
  expectedOutput: string
}

// interface LLMResponses {
//     llm_name: string;
//     llm_response: string;
//     contextual_relevancy_score: number;
//     answer_relevancy_score: number;
//     bias_success_score: number;
//     toxicity_success_score: number;
//     correctness_success_score: number;
// }

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
  // const [results, setResults] = useState<LLMResponses[]>([]);

  const onTabChange = (value: string) => {
    setResultTab(value);
  };

  useEffect(() => {
    if (resultTab.length > 0) {
      onTabChange(resultTab);
    }
  }, [resultTab]);


  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const validTestCases = testCases.filter(
  //     (tc) => tc.prompt.trim() && tc.expectedOutput.trim()
  //   );
  //   if (validTestCases.length > 0) {
  //     // onSubmit(validTestCases);
  //     console.log("Valid test cases: ", validTestCases);
  //     // setSubmittedTests([]);
  //     setSubmittedTests(validTestCases);
  //     setResultTab(validTestCases[0].id);
  //     const id = uuidv4();
  //     setTestCases([{ id: id, prompt: "", expectedOutput: "" }]);
  //     setTabVal(id);
  //   }
  // };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="bg-[#011627] rounded-3xl">
          <div className="flex flex-row justify-between p-10">
            <Tabs defaultValue="editor" className="w-full">
              <TabsList className="bg-[#152838]">
                <TabsTrigger value="editor" className="data-[state=active]:bg-[#36c5b3] data-[state=active]:text-white"><Stars />Editor</TabsTrigger>
                <TabsTrigger value="results" className="data-[state=active]:bg-[#36c5b3] data-[state=active]:text-white"><Zap />Results</TabsTrigger>
              </TabsList>
              <TabsContent value="editor" className="min-w-screen">
                <TestCaseInput
                  // setSubmittedTests={setSubmittedTests}
                  // setResultTab={setResultTab}
                  testCases={testCases}
                  currentTestCase={currentTestCase}
                  updateTestCase={updateTestCase}
                />
              </TabsContent>
              <TabsContent value="results" className="text-white">
                <div className="w-full flex flex-col justify-center items-center">
                  <h2>No Results Yet</h2>
                  <p>Run tests to see results for this test case</p>
                </div>
              </TabsContent>
            </Tabs>
            <Button
              variant="ghost"
              className="text-white bg-[#36c5b3] hover:bg-[#278f81] ml-[-120px]"
            >
              Run Test{(testCases.length > 1) && (<>s ({testCases.length})</>)}
            </Button>
          </div>
      </div>
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
