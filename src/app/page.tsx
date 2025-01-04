"use server";

import Dashboard from "@/components/custom/dashboard";
import { createResponse } from "./actions/createResponse";
import { createEmbedding } from "./actions/createEmbedding";


export default async function Home() {
  return (
    <Dashboard createResponse={createResponse} createEmbedding={createEmbedding} />
  );
}
