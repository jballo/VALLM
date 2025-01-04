"use client";

import { Button } from "../ui/button";


export default function Header() {
    return(
        <div className="w-full flex flex-row justify-between">
            <div>
                <h1 className="text-4xl">VALLM</h1>
            </div>
            <div className="flex flex-row gap-4">
                <Button variant="link">
                    Home
                </Button>
                <Button variant="link">
                    Features
                </Button>
                <Button variant="link">
                    Dashboard
                </Button>
            </div>
        </div>
    );
}