"use client";
import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (<div className="flex flex-row w-screen h-screen justify-center items-center">
      <SignIn />
  </div>);
}