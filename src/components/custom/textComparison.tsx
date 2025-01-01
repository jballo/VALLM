"use client";

import { Card, CardContent, CardHeader } from "../ui/card";



export default function TextComparison(){
    const text: string[] = [
        "ajflajf;alfla;jf;lasjf;lasjf;las", 
        "ajflajf;alfla;jf;lasjf;lasjf;las",
        "ajflajf;alfla;jf;lasjf;lasjf;las",
        "ajflajf;alfla;jf;lasjf;lasjf;las"
    ];
    return(
        <div className=" w-full h-full grid sm:grid-cols-1 md:grid-cols-2  place-items-center gap-3">
            {text && (
                text.map((txt, index) => (
                    <Card key={index} className="w-full h-full bg-black text-white">
                        <CardHeader>{index}</CardHeader>
                        <CardContent>{txt}</CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}