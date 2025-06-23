"use client";

import {
  useUser,
  SignedIn,
  SignInButton,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import { useEffect } from "react";
import { DollarSign, LogIn, Sparkle } from "lucide-react";
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
    <div className="w-full flex flex-row p-6 justify-between">
      <div className=" flex flex-row justify-center items-end gap-2 hover:cursor-pointer" onClick={() => router.push("/")}>
        <Image
          src="https://gw3qhbh6tl.ufs.sh/f/Q48fIVJi2U4uBSKDllQILryJKSD3OdXv0UQio5Eaezxjcbhl"
          alt="VALLM Logo"
          width={50}
          height={50}
          priority
        />
        <h1 className="hidden sm:flex text-3xl text-white">VALLM</h1>
      </div>
      <div className="flex flex-row gap-4">
        <Button
          variant="link"
          className="flex flex-row gap-1.5 text-white"
          onClick={() => router.push("/pricing")}
        >
          <DollarSign />
          <p className="hidden sm:flex">
            Pricing
          </p>
        </Button>
        <Button
          variant="link"
          className="flex flex-row gap-1.5 text-white"
          onClick={() => router.push("/dashboard")}
        >
          <Sparkle />
          <p className="hidden sm:flex">
            Dashboard
          </p>
        </Button>
        <div className="flex flex-row gap-1">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button>
                <p className="hidden md:flex">
                  Log In
                </p>
                <LogIn />
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
