"use client";

import React from "react";
import type { StaticImageData } from "next/image";

type LightButtonProps = {
  text: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  variant?: "regular" | "colored";
  img?: string | StaticImageData;
  imgClass?: string;
  style?: string;
  fullWidth?: boolean;
};

export default function LightButton({
  text,
  type = "button",
  onClick,
  disabled = false,
  fullWidth = false,
  style = "",
  variant = "regular",
  img = "",
  imgClass = "",
}: LightButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    onClick?.();
  };

  const variantClass = {
    regular: `      
              text-zinc-700 dark:text-white text-sm font-medium
              bg-white dark:bg-zinc-700
              
              border border-zinc-200 dark:border-zinc-600

              hover:bg-zinc-100  dark:hover:bg-zinc-800
              hover:text-zinc-900 dark:hover:text-zinc-100

              focus:bg-zinc-200 dark:focus:bg-zinc-500`,
    colored: `
              text-zinc-900 dark
              bg-white/50 dark:bg-black/10
              border border-black/10 dark:border-black/30`,
  }[variant];

  return (
    <div>
      <button
        type={type}
        onClick={handleClick}
        className={`
                    ${style}
                    ${fullWidth ? "w-full" : null}
                    cursor-pointer
                    flex items-center justify-center
                    p-2.5 rounded-lg

                    ${variantClass}
                `}
        disabled={disabled}
      >
        {img && (
          <img
            src={typeof img === "string" ? img : img.src}
            className={imgClass}
          />
        )}
        {text}
      </button>
    </div>
  );
}
