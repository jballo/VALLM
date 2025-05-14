"use client";

// import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

// import { v4 as uuidv4 } from "uuid";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { Toggle } from "../ui/toggle";
import { Check, ChevronDown } from "lucide-react";
import { Badge } from "../ui/badge";

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

interface ModelChoice {
  model: string;
  selected: boolean;
}

interface TestCaseInputProps {
  // setSubmittedTests: (testCases: TestCase[]) => void;
  // setResultTab: (defaultTab: string) => void;
  testCases: TestCase[];
  currentTestCase: string;
  updateTestCase: (
    id: string,
    field: "prompt" | "expectedOutput",
    value: string
  ) => void;
  setTestCases: (newTest: TestCase[]) => void;
}

export default function TestCaseInput({
  testCases,
  currentTestCase,
  updateTestCase,
  setTestCases,
}: TestCaseInputProps) {
  const currentTest = testCases.find((test) => test.id === currentTestCase);

  // useEffect(() => {
  //   console.log("Current Test: ", currentTest);
  // }, [currentTest]);

  // useEffect(() => {
  //   console.log("Test Cases: ", testCases);
  // }, [testCases]);

  const onPressedChange = (modelName: string) => {
    console.log("pressed...");

    const updatedTestCases = testCases.map((test) => {
      if (test.id === currentTestCase) {
        return {
          ...test,
          models: test.models.map((model) => {
            if (model.model === modelName) {
              return { ...model, selected: !model.selected };
            }
            return model;
          }),
        };
      }
      return test;
    });

    setTestCases(updatedTestCases);
  };

  const toggleAll = (value: boolean) => {
    if (!currentTest) return;

    const updatedTestCases = testCases.map((test) => {
      if (test.id === currentTestCase) {
        return {
          ...test,
          models: test.models.map((model) => ({
            ...model,
            selected: value,
          })),
        };
      }
      return test;
    });

    setTestCases(updatedTestCases);
  };

  const selectAll = () => toggleAll(true);

  const clearAll = () => toggleAll(false);

  return (
    <>
      {currentTestCase && testCases && (
        <div className="flex flex-col lg:flex-row w-full bg-[#011627] text-white">
          {/* Test Case Editor */}
          <div className="w-full p-6 flex flex-col gap-4">
            <div className="flex flex-col">
              <h3 className="text-xl font-bold">Test Case Editor</h3>
              <h4 className="text-xs">
                Define your test case prompt and expected output
              </h4>
            </div>
            <div className="flex flex-col gap-1.5">
              <h4 className="text-sm">Test Case Name</h4>
              <Input className="bg-[#213342] border-[0.5px] border-[#3F4E5D]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h4 className="text-sm">Prompt</h4>
              <Textarea
                className="bg-[#213342] border-[0.5px] border-[#3F4E5D]"
                placeholder="Enter your prompt here..."
                // value={prompt}
                value={
                  testCases.filter((test) => test.id === currentTestCase)[0]
                    .prompt
                }
                onChange={(e) =>
                  updateTestCase(currentTestCase, "prompt", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <h4 className="text-sm">Expected Output</h4>
              <Textarea
                className="bg-[#213342] border-[0.5px] border-[#3F4E5D]"
                placeholder="Enter your expected output here..."
                // value={expectedOutput}
                value={
                  testCases.filter((test) => test.id === currentTestCase)[0]
                    .expectedOutput
                }
                onChange={(e) =>
                  updateTestCase(
                    currentTestCase,
                    "expectedOutput",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
          {/* Models to Compare */}
          <div className="flex flex-col w-full p-6 gap-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold">Models to Compare</h3>
              <h4 className="text-xs">
                Select the models you want to include in your comparison
              </h4>
            </div>
            <div>
              {currentTest &&
              currentTest.models.filter((model) => model.selected == true)
                .length > 0 ? (
                <div className="w-full flex flex-row flex-wrap gap-2">
                  {currentTest.models
                    .filter((model) => model.selected == true)
                    .map((selectedModel, index) => (
                      <Badge key={index} className="bg-[#9D4EDD]">
                        {selectedModel.model}
                      </Badge>
                    ))}
                </div>
              ) : (
                <p>No Model Selected</p>
              )}
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-[#011627] border-[0.5px] border-[#3F4E5D] hover:bg-[#36c5b3] hover:text-white"
                  >
                    <div className="flex flex-row justify-between items-center w-full">
                      <p>Select Models</p>
                      <ChevronDown />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  className="bg-[#011627] p-0 border-[0.5px]"
                >
                  <Command className="w-full h-full bg-[#011627]">
                    <CommandInput
                      placeholder="Search Models..."
                      className="text-white"
                    />
                    <CommandList>
                      <CommandEmpty className="text-white">
                        No models found.
                      </CommandEmpty>
                      <CommandGroup heading="Models" className="text-white">
                        {currentTest &&
                          currentTest.models.map((model, index) => (
                            <CommandItem
                              key={index}
                              className="data-[selected=true]:bg-[#36c5b3] data-[selected=true]:text-white flex flex-row justify-between"
                              onSelect={() => {
                                console.log(
                                  "Command Item Pressed: ",
                                  model.model
                                );
                                onPressedChange(model.model);
                              }}
                            >
                              {model.model}
                              {model.selected && <Check />}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                      <CommandSeparator />
                      <div className="w-full flex flex-row justify-between items-center p-2">
                        {currentTest && (
                          <div className="w-full flex flex-row">
                            <p className="text-white">
                              {
                                currentTest.models.filter(
                                  (model) => model.selected === true
                                ).length
                              }{" "}
                              Selected
                            </p>
                          </div>
                        )}
                        <div className="flex flex-row items-center gap-2">
                          <Button
                            className="w-[70px] bg-[#011627] hover:bg-[#36c5b3] border-[1px] border-[#3F4E5D]"
                            onClick={selectAll}
                          >
                            Select All
                          </Button>
                          <Button
                            className="w-[70px] bg-[#011627] hover:bg-[#36c5b3] border-[1px] border-[#3F4E5D]"
                            onClick={clearAll}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <h3>Available Models</h3>
              {currentTest && (
                <div className="grid grid-cols-2 gap-3">
                  {currentTest.models.map((model, index) => (
                    <Toggle
                      key={index}
                      className="text-xs p-1 border-[1px] border-[#3F4E5D] bg-[#011627] hover:bg-[#062835] hover:text-white data-[state=on]:bg-[#062835] data-[state=on]:border-[#36c5b3] data-[state=on]:text-white"
                      pressed={model.selected}
                      onPressedChange={() => onPressedChange(model.model)}
                    >
                      {model.model}
                    </Toggle>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
