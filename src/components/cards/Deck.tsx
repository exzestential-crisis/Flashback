"use client";

import { useState } from "react";
import { getColorVariants } from "@/utils/colorUtils";
import KebabMenu from "../nav/KebabMenu";

type DeckType = {
  name: string;
  description: string;
  folderName: string;
  cardCount: number;
  colorId: number;
};

export default function Deck({
  name,
  description,
  folderName,
  cardCount,
  colorId,
}: DeckType) {
  const [isHovered, setIsHovered] = useState(false);

  // Get dynamic colors from utils
  const colors = getColorVariants(colorId);

  return (
    <div
      className="relative h-40 w-60"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Colored background layers container */}
      <div
        className="absolute inset-0 z-0 transition-transform duration-200"
        style={{
          transform: isHovered ? "translateY(-6px)" : "translateY(0)",
        }}
      >
        <div
          className="absolute right-0 h-full w-full rounded-2xl"
          style={{ backgroundColor: colors.dark }}
        />
        <div
          className="absolute right-0 h-full w-[95%] rounded-2xl z-10"
          style={{ backgroundColor: colors.base }}
        />
        <div
          className="absolute right-0 h-full w-[90%] rounded-2xl z-20"
          style={{ backgroundColor: colors.light }}
        />
      </div>

      {/* Content overlay */}
      <div
        className="
        absolute bottom-0 z-30
        bg-white dark:bg-zinc-700 
        h-2/3 w-full rounded-b-xl
        transition-all duration-200
      "
        style={{
          transform: isHovered ? "translateY(3px)" : "translateY(0)",
        }}
      >
        <div className="relative flex flex-grow flex-col h-full p-2">
          <KebabMenu
            className="absolute right-0 mt-1"
            options={[
              { label: "Edit", onClick: () => console.log("Edit clicked") },
              { label: "Delete", onClick: () => console.log("Delete clicked") },
            ]}
          />
          <div className="flex items-start justify-between">
            <div className="w-[90%]">
              <h2 className="font-bold text-lg p-0 truncate">{name}</h2>
              <p className="text-xs dark:text-zinc-400 p-0 truncate">
                {description}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto gap-2">
            <p className="text-sm dark:text-zinc-400">{folderName}</p>
            <p className="text-sm">{cardCount} Cards</p>
          </div>
        </div>
      </div>
    </div>
  );
}
