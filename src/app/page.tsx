//src/app/page.tsx
"use client";

import { AnimatedButton, LightButton } from "@/components/ui";
import Nav from "./components/Nav";
import AuthDebug from "./components/AuthDebug";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/signup");
    router.prefetch("/login");
  }, [router]);

  const handleSignupClick = () => {
    router.push("/signup");
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <div className="relative">
      <Nav />
      {/* <AuthDebug /> */}

      {/* Body */}
      <div className="relative flex flex-col min-h-screen justify-center">
        <div className="flex justify-center items-center">
          <div className="grid grid-cols-3">
            {/* Mascot */}
            <div className="col-span-2 flex justify-center">
              <img src="http://placehold.co/500" alt="" />
            </div>

            {/* Introduction */}
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-center lg:mb-10 lg:text-lg">
                FlashBack helps you master anything, anytime, <br />
                one digital card at a time.
              </h2>
              <div className="w-60">
                <AnimatedButton
                  text="Get Started"
                  fullWidth
                  style="m-4"
                  onClick={handleSignupClick}
                />
                <LightButton
                  text="I already have an account"
                  onClick={handleLoginClick}
                  fullWidth
                  style="m-4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Body */}
        <div className="absolute bottom-0 w-full">
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-4 gap-20 justify-items-center py-10">
              <p className="cursor-pointer">Flashcards</p>
              <p className="cursor-pointer">Study Mode</p>
              <p className="cursor-pointer">Quizzes</p>
              <p className="cursor-pointer">Match Mode</p>
            </div>
          </div>
        </div>
      </div>

      {/* Value Blocks */}
      <div className="value-blocks-container">
        {/* Brain */}
        <div className="grid grid-cols-5 py-20">
          <div className="col-span-2 flex justify-end">
            <img src="http://placehold.co/500" alt="" />
          </div>
          <div className="col-span-3 h-full flex items-center justify-center">
            <div className="text-center">
              <h4 className="text-lg font-semibold">
                Study smarter, not harder.
              </h4>
              <h5 className="text-sm text-zinc-600 dark:text-zinc-400">
                Master topics with intelligent flashcards that adapt to how well{" "}
                <br />
                you know the material—so you focus where it matters most.
              </h5>
            </div>
          </div>
        </div>

        {/* Clock */}
        <div className="grid grid-cols-5 py-20">
          <div className="col-span-3 h-full flex items-center justify-center">
            <div className="text-center">
              <h4 className="text-lg font-semibold">
                Review in minutes, retain for life.
              </h4>
              <h5 className="text-sm text-zinc-600 dark:text-zinc-400">
                Whether you’ve got 5 minutes or 50, Flashback helps you lock in
                <br />
                knowledge with fast, focused review sessions.
              </h5>
            </div>
          </div>
          <div className="col-span-2 flex justify-start">
            <img src="http://placehold.co/500" alt="" />
          </div>
        </div>

        {/* Access */}
        <div className="grid grid-cols-5 py-20">
          <div className="col-span-2 flex justify-end">
            <img src="http://placehold.co/500" alt="" />
          </div>
          <div className="col-span-3 h-full flex items-center justify-center">
            <div className="text-center">
              <h4 className="text-lg font-semibold">Your memory, on demand.</h4>
              <h5 className="text-sm text-zinc-600 dark:text-zinc-400">
                Access your flashcards anytime, anywhere. Perfect for cramming
                <br />
                before class or brushing up while in line for coffee.
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
