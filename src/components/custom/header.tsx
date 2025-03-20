"use client";

import {  useUser, SignedIn, SignInButton, SignedOut, SignOutButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
// import { useEffect, useState } from "react";
import Image from "next/image";
import { useEffect } from "react";


export default function Header() {
    const { user, isSignedIn } = useUser();
    // const [userImage, setUserImage] = useState<string>("");
    
    useEffect(() => {
        if (user && isSignedIn){
            console.log("profile url: ", user.imageUrl);
        }
    }, [user, isSignedIn]);

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
                <div className="flex flex-row gap-1">
                    <SignedIn>
                        <SignOutButton>
                            <Button>Sign Out</Button>
                        </SignOutButton>
                        { (user && isSignedIn) && (
                            
                            <Image
                                src={user.imageUrl}
                                width={40}
                                height={30}
                                alt={"Profile"}
                                className="rounded-lg"
                            />
                        )

                        }
                    </SignedIn>
                    <SignedOut>
                        <SignInButton>
                            <Button>Sign-In</Button>
                        </SignInButton>
                    </SignedOut>

                </div>
            </div>
        </div>
    );
}