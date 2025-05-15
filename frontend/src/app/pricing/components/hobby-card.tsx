"use client";

import { Button } from "@/atoms/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/atoms/card";

export default function HobbyCard() {
  return (
    <Card className="w-full bg-[#091931] border-[#5682CE] border-b-4 text-white">
      <CardHeader className="text-3xl font-bold">Hobby</CardHeader>
      <CardContent>
        <h4 className="text-lg">8,000 credits/month</h4>
        <br />
        <h3 className="text-md">$_/month</h3>
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
      </CardContent>
      <CardFooter className="w-full">
        <Button className="w-full bg-[#5682CE] hover:bg-[#4568a8]">
          Curently Not Available
        </Button>
      </CardFooter>
    </Card>
  );
}
