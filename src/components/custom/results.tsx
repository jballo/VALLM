"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface LLMResponses {
    llm_name: string;
    llm_response: string;
    contextual_relevancy_score: number;
    answer_relevancy_score: number;
    bias_success_score: number;
    toxicity_success_score: number;
}

interface TestCaseResult {
  testCaseId: string
  prompt: string
  expectedOutput: string
  responses: LLMResponses[]
}

interface ResultsProps {
    testCaseResults: TestCaseResult[];
}

const chartData = [
  { metric: "Relevance", score: 0.8 },
  { metric: "Versatile", score: 0.2 },
  { metric: "Toxicity", score: 0.4 },
  { metric: "Bias", score: 0.6, },
  { metric: "Prompt Alignment", score: 0.65 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
} satisfies ChartConfig


export default function Results({ testCaseResults }: ResultsProps){


    return(<div>
        <div>
            <Tabs defaultValue="result_0">
                <TabsList>
                    {testCaseResults.map((result, index) => (
                        <TabsTrigger key={index} value={`result_${index}`}>Result {index + 1}</TabsTrigger>
                    ))}
                </TabsList>

                {testCaseResults.map((result, index) => (
                    <TabsContent key={index} value={`result_${index}`}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Result {index + 1}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <h2>Prompt: {result.prompt}</h2>
                                <h2>Expected Output: {result.expectedOutput}</h2>
                                <Accordion type="multiple">
                                    {result.responses.map((response, index) => (
                                        <AccordionItem key={`${response.llm_name}_${index}`} value={response.llm_name}>
                                            <AccordionTrigger className="text-lg">{response.llm_name}</AccordionTrigger>
                                            <AccordionContent className="grid grid-cols-2">
                                                <div>
                                                    <h2 className="text-lg">Output:</h2>
                                                    <p className="text-md">{response.llm_response}</p>
                                                    <h2>Contextual Relevancy Score:</h2>
                                                    <p className="text-md">{response.contextual_relevancy_score}</p>
                                                    <h2>Answer Relevancy Score:</h2>
                                                    <p className="text-md">{response.answer_relevancy_score}</p>
                                                    <h2>Bias Success Score:</h2>
                                                    <p className="text-md">{response.bias_success_score}</p>
                                                    <p className="text-md">{response.answer_relevancy_score}</p>
                                                    <h2>Toxicity Success Score:</h2>
                                                    <p className="text-md">{response.toxicity_success_score}</p>
                                                </div>
                                                <div className="">
                                                    <ChartContainer config={chartConfig}>
                                                        <BarChart 
                                                            accessibilityLayer 
                                                            data={chartData}
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
                                                            <Bar
                                                                dataKey="score"
                                                                layout="vertical"
                                                                radius={4}
                                                            >
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
                    </TabsContent>
                ))}
            </Tabs>
        </div>
        <div>
            
        </div>
    </div>);
}