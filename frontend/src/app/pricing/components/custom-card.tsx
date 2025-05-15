"use client";

import { Button } from "@/atoms/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/atoms/card";

export default function CustomCard() {
  return (
    <Card className="w-full bg-[#091931] border-[#7A3BEB] border-b-4 text-white">
      <CardHeader className="text-3xl font-bold">Custom</CardHeader>
      <CardContent>
        <h4 className="text-lg">10,000 credits/month</h4>
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
        <Button className="w-full bg-[#7A3BEB] hover:bg-[#6431c5]">
          Curently Not Available
        </Button>
      </CardFooter>
    </Card>
  );
}
