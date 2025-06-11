"use client";

import { useTheme } from "next-themes";
import Lottie from "lottie-react";

import { LightLoader, DarkLoader } from "../../../public";

export default function CardLoading() {
  const { resolvedTheme } = useTheme();

  const animationData = resolvedTheme === "dark" ? DarkLoader : LightLoader;

  return (
    <div className="absolute inset-0 flex items-center justify-center h-screen w-screen bg-black/70 z-50">
      <div className="w-100 h-80 rounded-2xl flex items-center justify-center">
        <Lottie
          animationData={animationData}
          loop={true}
          className="w-[600px] h-[600px]"
        />
      </div>
    </div>
  );
}
