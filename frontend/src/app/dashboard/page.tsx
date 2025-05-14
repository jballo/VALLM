"use server";

import { createEmbedding } from "../actions/createEmbedding";
import DashboardClient from "./components/DashboardClient";

export default async function DasbhoardPage() {
  return <DashboardClient createEmbedding={createEmbedding} />;
}
