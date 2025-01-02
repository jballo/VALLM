"use server";

import Dashboard from "@/components/custom/dashboard";
import { createResponse } from "./actions/createResponse";


export default async function Home() {
  return (
    <Dashboard createResponse={createResponse}/>
  );
}
