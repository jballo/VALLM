"use client";

import { Plus, SeparatorHorizontal, SidebarIcon, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

// interface SidebarProps {

// }

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState<boolean>(false);


    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    }

    return (<div className={cn("flex flex-col min-h-full max-h-[80vh] bg-[#091931]", {
        "w-[240px]": !collapsed,
        "w-[50px]": collapsed,
    })}>
        {/* Sidebar Header */}
        <div className={cn("flex flex-row h-1/10 p-4 items-center text-white", {
            "justify-center": collapsed,
            "justify-between": !collapsed,
        })}>
            {!collapsed && <h3>Test Cases</h3>}
            <Button 
                variant="ghost"
                className="w-[10px] bg-[#091931] hover:bg-[#36c5b3]"
                onClick={toggleSidebar}
            >
                <SidebarIcon />
            </Button>
        </div>
        <div className="w-full flex justify-center">
            <SeparatorHorizontal className="h-0.5 w-[90%]  bg-[#3F4E5D]"/>
        </div>
        {/* Sidebar Content */}
        <div className="flex flex-col h-full p-1 overflow-y-auto gap-1 text-white">
            <Button
                variant="ghost"
                className="hover:bg-[#36c5b3]"
            >
                {!collapsed ? "Test Case 1" : "1"}
            </Button>
            <Button
                variant="ghost"
                className="hover:bg-[#36c5b3]"
            >
                {!collapsed ? "Test Case 2" : "2"}
            </Button>
            <Button
                variant="ghost"
                className="hover:bg-[#36c5b3]"
            >
                {!collapsed ? "Test Case 3" : "3"}
            </Button>
            <Button
                variant="ghost"
                className="hover:bg-[#36c5b3]"
            >
                {!collapsed ? "Test Case 4" : "4"}
            </Button>

        </div>
        <div className="w-full flex justify-center">
            <SeparatorHorizontal className="h-0.5 w-[90%]  bg-[#3F4E5D]"/>
        </div>
        {/* Sidebar Footer */}
        <div className={cn("flex gap-2 h-1/10 p-2", {
            "justify-center flex-col": collapsed,
            "justify-between flex-row": !collapsed,
        })}>
            <Button className="w-full bg-[#36c5b3] hover:bg-[#278f81]">
                {!collapsed ? "Add Test Case" : <Plus />}
            </Button>
            <Button className="w-[10px] bg-[#011627] hover:bg-[#36c5b3]"><Upload /></Button>
        </div>
    </div>);
}