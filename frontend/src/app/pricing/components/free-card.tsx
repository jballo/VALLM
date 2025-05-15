"use client";

import { Button } from "@/atoms/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/atoms/card";

export default function FreeCard() {
  return (
    <Card className="w-full bg-[#091931] border-[#79c8bf] border-b-4 text-white">
      <CardHeader className="text-3xl font-bold">Free</CardHeader>
      <CardContent>
        <h4 className="text-lg">5000 credits/month</h4>
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
        <Button className="w-full bg-[#79c8bf] hover:bg-[#5ba89f]">
          Curently Not Available
        </Button>
      </CardFooter>
    </Card>
  );
}
