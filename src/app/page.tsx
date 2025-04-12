"use server";

import Dashboard from "@/components/custom/dashboard";
import { createEmbedding } from "./actions/createEmbedding";


export default async function Home() {
  return (
    <Dashboard createEmbedding={createEmbedding} />
  );
}
