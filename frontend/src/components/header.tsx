"use client";

import {
  useUser,
  SignedIn,
  SignInButton,
  SignedOut,
  SignOutButton,
} from "@clerk/nextjs";
import Image from "next/image";
import { useEffect } from "react";
import { Home, LayoutDashboard, Sparkle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/atoms/button";

export default function Header() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  // const [userImage, setUserImage] = useState<string>("");

  useEffect(() => {
    if (user && isSignedIn) {
      console.log("profile url: ", user.imageUrl);
    }
  }, [user, isSignedIn]);

  return (
    <div className="w-full flex flex-row justify-between">
      <div className=" flex flex-row justify-center items-end gap-2">
        <Image
          src="https://gw3qhbh6tl.ufs.sh/f/Q48fIVJi2U4uBSKDllQILryJKSD3OdXv0UQio5Eaezxjcbhl"
          alt="VALLM Logo"
          width={50}
          height={50}
        />
        <h1 className="text-3xl text-white">VALLM</h1>
      </div>
      <div className="flex flex-row gap-4">
        <Button
          variant="link"
          className="flex flex-row gap-1.5 text-white"
          onClick={() => router.push("/")}
        >
          <Home /> Home
        </Button>
        <Button
          variant="link"
          className="flex flex-row gap-1.5 text-white"
          onClick={() => router.push("/pricing")}
        >
          <LayoutDashboard /> Features
        </Button>
        <Button
          variant="link"
          className="flex flex-row gap-1.5 text-white"
          onClick={() => router.push("/dashboard")}
        >
          <Sparkle /> Dashboard
        </Button>
        <div className="flex flex-row gap-1">
          <SignedIn>
            <SignOutButton>
              <Button>Sign Out</Button>
            </SignOutButton>
            {user && isSignedIn && (
              <Image
                src={user.imageUrl}
                width={40}
                height={30}
                alt={"Profile"}
                className="rounded-lg"
              />
            )}
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
