"use client";

import { useEffect, useState } from "react";
import Header from "./header";
import PromptForm from "./promptform";
import LLMResponseComparison from "./llm-response-comparison";
import Sidebar from "./sidebar";
import { v4 as uuidv4 } from "uuid";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { TriangleAlert, X } from "lucide-react";

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

interface CreateEmbeddingProp {
  createEmbedding: (
    url: string
  ) => Promise<{ success: boolean; response?: string; error?: string }>;
}

interface DashboardProps {
  createEmbedding: CreateEmbeddingProp["createEmbedding"];
}

export default function DashboardClient({ createEmbedding }: DashboardProps) {
  const [url, setUrl] = useState<string>("");
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [currentTestCase, setCurrentTestCase] = useState<string>("");
  const [testCaseResults, setTestCaseResults] = useState<TestCaseResult[]>([]);

  const [urlAlert, setUrlAlert] = useState<boolean>(false);

  const addTestCase = () => {
    const id = uuidv4();
    // setTestCases([...testCases, { id: id, prompt: "", expectedOutput: "" }]);
    setTestCases((prev) => [
      ...prev,
      {
        id: id,
        prompt: "",
        expectedOutput: "",
        models: [
          {
            model: "llama-3.3-70b-versatile",
            selected: false,
          },
          {
            model: "llama-3.1-8b-instant",
            selected: false,
          },
          {
            model: "mistral-saba-24b",
            selected: false,
          },
          {
            model: "gpt-4o-mini",
            selected: false,
          },
        ],
      },
    ]);
    // setTabVal(id);
    setCurrentTestCase(id);
  };

  const updateTestCase = (
    id: string,
    field: "prompt" | "expectedOutput",
    value: string
  ) => {
    setTestCases(
      testCases.map((tc) => (tc.id === id ? { ...tc, [field]: value } : tc))
    );
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      console.log("Note valid url: Error: ", error);
      return false;
    }
    // const pattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*$/;
    // const valid = pattern.test(url);
    // console.log(`Valid URL (${url}): `, valid);
    // return valid;
  };

  const handleSubmit = async () => {
    const validTestCases = testCases.filter(
      (tc) => tc.prompt.trim() && tc.expectedOutput.trim()
    );
    if (!isValidUrl(url)) {
      setUrlAlert(true);
      return;
    }

    if (validTestCases.length > 0) {
      console.log("Valid test cases: ", validTestCases);

      await Promise.all(
        validTestCases.map(async (test) => {
          try {
            // const models = test.models.filter((model) => {
            //     if (model.selected == true) {
            //         return model.model;
            //     }
            // });
            const models: string[] = [];

            // for (const model in test.models) {
            //     console.log(model[]);
            // }

            test.models.map((model) => {
              if (model.selected == true) {
                models.push(model.model);
              }
            });
            console.log("models: ", models);

            const response = await fetch(`/api/create-response`, {
              method: "POST",
              headers: {
                "Content-Type": "text/event-stream",
              },
              body: JSON.stringify({
                text: test.prompt,
                url: url,
                expectedOutput: test.expectedOutput,
                models,
              }),
            });

            if (!response.ok) {
              // console.log("Failed to generate llm response");
              throw new Error(
                `Failed to generate llm response. Status: ${response.status}`
              );
            }
            const res = await response.text();
            const arr = res.split("data: ");
            const validArr = arr.filter((item) => item.length > 0);
            // const res = await resonse.json();
            console.log("Res: ", res);
            console.log("arr: ", arr);
            console.log("Valid Arr: ", validArr);

            const llm_arr: LLMResponse[] = validArr.map((llm_res) => {
              console.log("llm_res: ", llm_res);
              const parsedItem = JSON.parse(llm_res);
              return {
                llm_name: parsedItem.llm_name,
                llm_response: parsedItem.llm_response,
                contextual_relevancy_score:
                  parsedItem.contextual_relevancy_score,
                answer_relevancy_score: parsedItem.answer_relevancy_score,
                bias_success_score: parsedItem.bias_success_score,
                toxicity_success_score: parsedItem.toxicity_success_score,
                correctness_success_score: parsedItem.correctness_success_score,
              };
            });

            const singleTestCaseRes = {
              id: test.id,
              prompt: test.prompt,
              expectedOutput: test.expectedOutput,
              llm_response: llm_arr,
            };

            const testCaseCaseFound = testCaseResults.find(
              (t) => t.id == test.id
            );

            if (testCaseCaseFound) {
              setTestCaseResults((prev) =>
                prev.map((t) => {
                  if (t.id === test.id) {
                    return {
                      ...test,
                      llm_response: llm_arr,
                    };
                  }
                  return t;
                })
              );
              return;
            }

            setTestCaseResults((prev) => [...prev, singleTestCaseRes]);
          } catch (error) {
            console.log("Error: ", error);
            const singleTestCase = {
              id: test.id,
              prompt: test.prompt,
              expectedOutput: test.expectedOutput,
              llm_response: [
                {
                  llm_name: "n/a",
                  llm_response: "n/a",
                  contextual_relevancy_score: 0,
                  answer_relevancy_score: 0,
                  bias_success_score: 0,
                  toxicity_success_score: 0,
                  correctness_success_score: 0,
                },
              ],
            };

            setTestCaseResults((prev) => [...prev, singleTestCase]);
          }
        })
      );
    }
  };

  useEffect(() => {
    console.log("Mounting Dashboard Client...");
    addTestCase();

    return () => {
      console.log("Unmounting Dashboard Client...");
    };
  }, []);

  // useEffect(() => {
  //     console.log("Test cases: ", testCases);
  // }, [testCases]);

  // useEffect(() => {
  //     console.log("Current test case: ", currentTestCase);
  // }, [currentTestCase]);

  useEffect(() => {
    console.log("Results: ", testCaseResults);
  }, [testCaseResults]);

  return (
    <div className="w-full min-h-screen p-12 flex flex-col gap-6 bg-[#011627]">
      <Header />
      <div className="flex flex-row w-full h-full border-[1px] border-[#332E5C] rounded-xl">
        <Sidebar
          testCases={testCases}
          addTestCase={addTestCase}
          currentTestCase={currentTestCase}
          setCurrentTestCase={setCurrentTestCase}
        />
        <div className="w-full">
          <div className="border-b-[1px] border-[#332E5C] p-4">
            <PromptForm
              createEmbedding={createEmbedding}
              url={url}
              setUrl={setUrl}
            />
          </div>
          {urlAlert && (
            <div className="flex flex-row justify-center w-full px-4 pt-4">
              <Alert
                variant="destructive"
                className="flex flex-row justify-between items-center w-full h-[40px]"
              >
                <AlertDescription className="flex flex-row items-center text-center gap-3">
                  <TriangleAlert />
                  Enter a valid url to submit a test.
                </AlertDescription>
                <Button
                  variant="destructive"
                  className="w-7 h-7"
                  onClick={() => setUrlAlert(false)}
                >
                  <X />
                </Button>
              </Alert>
            </div>
          )}
          <LLMResponseComparison
            // url={url}
            testCases={testCases}
            currentTestCase={currentTestCase}
            updateTestCase={updateTestCase}
            handleSubmit={handleSubmit}
            testCaseResults={testCaseResults}
            setTestCases={setTestCases}
          />
        </div>
      </div>
    </div>
  );
}
