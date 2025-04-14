"use client";

import { SidebarIcon, Upload } from "lucide-react";
import { Button } from "../ui/button";

interface SidebarProps {

}

export default function Sidebar({}: SidebarProps) {
    return (<div className="flex flex-col w-[240px] min-h-full max-h-[80vh] bg-[#091931]">
        <div className="flex flex-row h-1/10 p-4 items-center justify-between text-white">
            <h3>Test Cases</h3>
            <Button 
                variant="ghost"
                className="w-[10px] bg-[#091931] hover:bg-[#36c5b3]"
            >
                <SidebarIcon />
            </Button>
        </div>
        <div className="flex flex-col h-full p-1 overflow-y-auto gap-1 text-white">
            <Button
                variant="ghost"
                className="hover:bg-[#36c5b3]"
            >Test Case 1</Button>
            <Button
                variant="ghost"
                className="hover:bg-[#36c5b3]"
            >Test Case 2</Button>
            <Button
                variant="ghost"
                className="hover:bg-[#36c5b3]"
            >Test Case 3</Button>
            <Button
                variant="ghost"
                className="hover:bg-[#36c5b3]"
            >Test Case 4</Button>

        </div>
        <div className="flex flex-row gap-2 h-1/10 p-2">
            <Button className="w-full bg-[#36c5b3] hover:bg-[#278f81]">Add Test Case</Button>
            <Button className="w-[10px] bg-[#011627] hover:bg-[#36c5b3]"><Upload /></Button>
        </div>
    </div>);
}