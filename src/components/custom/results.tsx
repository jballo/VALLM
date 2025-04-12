"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { TabsContent } from "../ui/tabs";

interface LLMResponses {
    llm_name: string;
    llm_response: string;
    contextual_relevancy_score: number;
    answer_relevancy_score: number;
    bias_success_score: number;
    toxicity_success_score: number;
    correctness_success_score: number;
}

interface TestCase {
  id: string;
  prompt: string;
  expectedOutput: string;
}

interface ResultsProps {
  index: number;
  url: string;
  test: TestCase;
}


const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export default function Results({
  index,
  url,
  test,
}: ResultsProps) {
  const [resultsData, setResultsData] = useState<LLMResponses[]>([]);

  const fetchData = async () => {
      console.log("Test: ", test);
      // const response = await createResponse(test.prompt, url);

      // if (response.error || !response.response) {
      //   return;
      // }
      // console.log("Response: ", response.response);
      try {
        const text = test.prompt;
        const expectedOutput = test.expectedOutput;
  
        const response = await fetch('/api/create-response', {
          method: "POST",
          headers: {
            "Content-Type": "text/event-stream",
          },
          body: JSON.stringify({ text, url, expectedOutput })
        })
  
        if (!response.ok) {
          console.log("Error for response");
        }
  
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
  
        if (!reader) {
          throw new Error(`No reader available for response`);
        }
        while (true) {
          const { value, done } = await reader.read();
          if ( done ) {
            console.log("Stream complete");
            break;
          }
          console.log("Received...");
          const chunk = decoder.decode(value);
          console.log("Chunk: ", chunk);
          const chunkList = chunk.split("data: ");
          console.log("Chunk List: ", chunkList);
          const jsonList: LLMResponses[] = chunkList.filter((chunk) => chunk.length > 0).map((chunk) => {
            const chunkJson = JSON.parse(chunk);
            console.log("Chunk Json: ", chunkJson);
            const resp = {
                llm_name: chunkJson.llm_name,
                llm_response: chunkJson.llm_response,
                // llm_relevancy_score: chunkJson.llm_relevancy_score,
                contextual_relevancy_score: chunkJson.contextual_relevancy_score,
                answer_relevancy_score: chunkJson.answer_relevancy_score,
                bias_success_score: chunkJson.bias_success_score,
                toxicity_success_score: chunkJson.toxicity_success_score,
                correctness_success_score: chunkJson.correctness_success_score,

            }
            return resp
          });
          setResultsData((prev) => [...prev, ...jsonList])
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    };

  useEffect(() => {
    fetchData();
    // setResultsData([]);
  }, [test.id, url]);

  return (
    <TabsContent key={test.id} value={test.id}>
      {resultsData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Result {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <h2>Prompt: {test.prompt}</h2>
            <h2>Expected Output: {test.expectedOutput}</h2>
            <Accordion type="multiple">
              {resultsData.map((response, index) => (
                <AccordionItem key={`${response.llm_name}_${index}`} value={response.llm_name}>
                  <AccordionTrigger className="text-lg">{response.llm_name}</AccordionTrigger>
                  <AccordionContent className="grid grid-cols-2">
                    <div>
                        <h2 className="text-lg">Output:</h2>
                        <p className="text-md">{response.llm_response}</p>
                        <p className="text-md">Correctness Score: {(Number(response.correctness_success_score)).toFixed(2)}</p>
                        <p className="text-md">Contextual Relevancy Score: {(Number(response.contextual_relevancy_score)).toFixed(2)}</p>
                        <p className="text-md">Answer Relevancy Score: {((Number(response.answer_relevancy_score))).toFixed(2)}</p>
                        <p className="text-md">Bias Success Score: {(Number(response.bias_success_score)).toFixed(2)}</p>
                        <p className="text-md">Toxicity Success Score: {(Number(response.toxicity_success_score)).toFixed(2)}</p>
                    </div>
                    <div className="">
                      <ChartContainer config={chartConfig}>
                        <BarChart 
                          accessibilityLayer 
                          data={[
                            { metric: "Correctness", score: (Number(response.correctness_success_score)).toFixed(2) },
                            { metric: "Contextual Relevancy", score: (Number(response.contextual_relevancy_score)).toFixed(2) },
                            { metric: "Answer Relevancy", score: (Number(response.answer_relevancy_score)).toFixed(2) },
                            { metric: "Toxicity", score: (Number(response.toxicity_success_score)).toFixed(2) },
                            { metric: "Bias", score: (Number(response.bias_success_score)).toFixed(2) },
                          ]}
                          layout="vertical"
                        >
                          <CartesianGrid horizontal={false} />
                          <YAxis
                            dataKey="metric"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            hide
                          />
                          <XAxis dataKey="score" type="number" hide />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                          />
                          <Bar dataKey="score" layout="vertical" radius={4}>
                            <LabelList
                              dataKey="metric"
                              position="insideLeft"
                              offset={8}
                              fontSize={12}
                            />
                            <LabelList
                              dataKey="score"
                              position="right"
                              offset={8}
                              fontSize={12}
                            />
                          </Bar>
                        </BarChart>
                      </ChartContainer>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[260px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[450px]" />
            <Skeleton className="h-4 w-[450px]" />
            <Skeleton className="h-4 w-[450px]" />
            <Skeleton className="h-4 w-[450px]" />
          </div>
        </div>
      )}
    </TabsContent>
  );
}
