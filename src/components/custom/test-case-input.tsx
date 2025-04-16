"use client";

// import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

// import { v4 as uuidv4 } from "uuid";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";

// interface TestCase {
//   id: string;
//   prompt: string;
//   expectedOutput: string;
// }

// interface TestCaseInputProps {
//   setSubmittedTests: (testCases: TestCase[]) => void;
//   setResultTab: (defaultTab: string) => void;
// }

export default function TestCaseInput() {
  // const [testCases, setTestCases] = useState<TestCase[]>([]);

  // const addTestCase = () => {
  //   // const id = Date.now().toString();
  //   const id = uuidv4();
  //   setTestCases([...testCases, { id: id, prompt: "", expectedOutput: "" }]);
  //   setTabVal(id);
  // };

  // const removeTestCase = (id: string) => {
  //   setTestCases(testCases.filter((tc) => tc.id !== id));
  // };

  // const updateTestCase = (
  //   id: string,
  //   field: "prompt" | "expectedOutput",
  //   value: string
  // ) => {
  //   setTestCases(
  //     testCases.map((tc) => (tc.id === id ? { ...tc, [field]: value } : tc))
  //   );
  // };


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

  // useEffect(() => {
  //   addTestCase();
  // }, []);

  return (<div className="flex flex-col lg:flex-row w-full">
    <div className="w-full">
      <h3>Test Case Editor</h3>
      <div>
        <h4>Test Case Name</h4>
        <Input />
      </div>
      <div>
        <h4>Prompt</h4>
        <Textarea />
      </div>
      <div>
        <h4>Expected Output</h4>
        <Textarea />
      </div>
    </div>
    <div className="flex flex-col w-full p-3 gap-2">
      <div className="flex flex-col gap-1">
        <h3>Models to Compare</h3>
        <h4 className="text-xs">Select the models you want to include in your comparison</h4>
      </div>
      <div>
        <p>No Model Selected</p>
      </div>
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full">Select Models</Button>
          </PopoverTrigger>
          <PopoverContent>
            <Command>
              <CommandInput placeholder="Search Models..." />
              <CommandList>
                <CommandEmpty>No models found.</CommandEmpty>
                <CommandGroup heading="Models">
                  <CommandItem>GPT-4o-min</CommandItem>
                  <CommandItem>Llama 3.3 70B Versatile</CommandItem>
                  <CommandItem>Qwen 2.5 32B</CommandItem>
                  <CommandItem>Llama 3.1 8B Instant</CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <h3>Available Models</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button className="text-xs p-1">GPT-4o-min</Button>
          <Button className="text-xs p-1">Llama 3.3 70B Versatile</Button>
          <Button className="text-xs p-1">Qwen 2.5 32B</Button>
          <Button className="text-xs p-1">Llama 3.1 8B Instant</Button>
        </div>
      </div>
    </div>
  </div>);
}
