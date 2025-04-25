"use server";

import DashboardClient from "@/components/custom/DashboardClient";
import { createEmbedding } from "../actions/createEmbedding";

export default async function DasbhoardPage() {
  return (

    <DashboardClient createEmbedding={createEmbedding} />
  );
}
