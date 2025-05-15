"use client";

import { Plus, SeparatorHorizontal, SidebarIcon, Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/atoms/dialog";
import Uploader from "./Uploader";
import { parse } from "papaparse";
import { v4 as uuidv4 } from "uuid";

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

interface SidebarProps {
  testCases: TestCase[];
  addTestCase: () => void;
  currentTestCase: string;
  setCurrentTestCase: (testId: string) => void;
  setTestCases: (tests: TestCase[]) => void;
}

export default function Sidebar({
  testCases,
  addTestCase,
  currentTestCase,
  setCurrentTestCase,
  setTestCases,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [uploaderDialogOpen, setUploaderDialogOpen] = useState<boolean>(false);
  // const [csvFile, setCsvFile] = useState<File | null>(null);
  // const fileInputRef = useRef

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleFileSelected = useCallback((file: File | null) => {
    // setFile();
    if (file) {
      console.log(file);
      parse(file, {
        complete: (result) => {
          console.log("result: ", result.data);

          const res = result.data as string[][];

          const newTestCases: TestCase[] = [];

          res.forEach((test: string[], index) => {
            if (index !== 0) {
              const modelList = test[3].split(";");
              console.log("modelList: ", modelList);
              const choices: ModelChoice[] = [
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
              ];

              const selectedChoices = choices.map((model) => ({
                ...model,
                selected: modelList.includes(model.model),
              }));
              console.log("SelectedChoices: ", selectedChoices);

              const newTest: TestCase = {
                id: uuidv4(),
                prompt: test[1],
                expectedOutput: test[2],
                models: selectedChoices,
              };
              newTestCases.push(newTest);
            }
          });

          console.log("newTestCases: ", newTestCases);

          setTestCases(newTestCases);
          setCurrentTestCase(newTestCases.length > 0 ? newTestCases[0].id : "");
          setUploaderDialogOpen(false);
        },
      });
    }
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col min-h-full max-h-[80vh] bg-[#091931] rounded-l-xl border-r-[1px] border-[#332E5C]",
        {
          "w-[240px]": !collapsed,
          "w-[50px]": collapsed,
        }
      )}
    >
      {/* Sidebar Header */}
      <div
        className={cn("flex flex-row h-1/10 p-4 items-center text-white", {
          "justify-center": collapsed,
          "justify-between": !collapsed,
        })}
      >
        {!collapsed && <h3>Test Cases</h3>}
        <Button
          variant="ghost"
          className="w-[10px] bg-[#091931] hover:bg-[#36c5b3]"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
      </div>
      <div className="w-full flex justify-center">
        <SeparatorHorizontal className="h-0.5 w-[90%]  bg-[#3F4E5D]" />
      </div>
      {/* Sidebar Content */}
      <div className="flex flex-col h-full p-1 overflow-y-auto gap-1 text-white">
        {testCases.map((test, index) => (
          <Button
            key={index}
            variant="ghost"
            className={cn("hover:bg-[#36c5b3] hover:text-white", {
              "bg-[#36c5b3]": test.id === currentTestCase,
            })}
            onClick={() => setCurrentTestCase(test.id)}
          >
            {!collapsed ? `Test case ${index + 1}` : `${index + 1}`}
          </Button>
        ))}
      </div>
      <div className="w-full flex justify-center">
        <SeparatorHorizontal className="h-0.5 w-[90%]  bg-[#3F4E5D]" />
      </div>
      {/* Sidebar Footer */}
      <div
        className={cn("flex gap-2 h-1/10 p-2", {
          "justify-center flex-col": collapsed,
          "justify-between flex-row": !collapsed,
        })}
      >
        <Button
          className="w-full bg-[#36c5b3] hover:bg-[#278f81]"
          onClick={addTestCase}
        >
          {!collapsed ? "Add Test Case" : <Plus />}
        </Button>
        <Dialog open={uploaderDialogOpen} onOpenChange={setUploaderDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-[10px] bg-[#011627] hover:bg-[#36c5b3]">
              <Upload />
            </Button>
          </DialogTrigger>
          <DialogContent className="flex flex-col bg-[#0E2232] border-none text-white h-[85%]">
            <DialogHeader className="h-10">
              <DialogTitle className="text-xl">Import Test Cases</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-24 w-full h-full">
              {/* File Uploader */}
              <Uploader onFileSelected={handleFileSelected} />
              {/* Example Table */}
              <div className="flex flex-col justify-center items-center w-5/6 gap-4 h-2/6">
                <div className="w-full text-start">
                  <p className="text-xs">Expected CSV format</p>
                </div>
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr>
                      <th className="border border-[#3C2F66] bg-[#1E2744] p-1 text-left font-medium">
                        name
                      </th>
                      <th className="border border-[#3C2F66] bg-[#1E2744] p-1 text-left font-medium">
                        prompt
                      </th>
                      <th className="border border-[#3C2F66] bg-[#1E2744] p-1 text-left font-medium">
                        expectedOutput
                      </th>
                      <th className="border border-[#3C2F66] bg-[#1E2744] p-1 text-left font-medium">
                        models
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-[#3C2F66] p-1">Test 1</td>
                      <td className="border border-[#3C2F66] p-1">
                        What is the capital of France?
                      </td>
                      <td className="border border-[#3C2F66] p-1">
                        Paris is the capital of France.
                      </td>
                      <td className="border border-[#3C2F66] p-1">
                        gpt-4;claude-3
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-[#3C2F66] p-1">Test 2</td>
                      <td className="border border-[#3C2F66] p-1">
                        Explain quantum computing
                      </td>
                      <td className="border border-[#3C2F66] p-1">
                        Quantum computing uses quantum bits...
                      </td>
                      <td className="border border-[#3C2F66] p-1">
                        gpt-4;gpt-3.5;gemini-pro
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-[#3C2F66] p-1">Test 3</td>
                      <td className="border border-[#3C2F66] p-1">
                        Write a haiku about nature
                      </td>
                      <td className="border border-[#3C2F66] p-1">
                        Leaves dance in the wind
                        <br />
                        Sunlight filters through branches
                        <br />
                        Earth breathes peacefully
                      </td>
                      <td className="border border-[#3C2F66] p-1">
                        llama-3;mistral
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="flex flex-col gap-2 w-full text-start">
                  <p className="text-xs">
                    Note: In the actual CSV file, values with commas or line
                    breaks should be enclosed in double quotes. For the models
                    column, use semicolons to separate multiple model IDs.
                  </p>
                  <p className="text-xs">
                    Available model IDs: gpt-4, gpt-3.5, claude-3, gemini-pro,
                    llama-3, mistral
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
