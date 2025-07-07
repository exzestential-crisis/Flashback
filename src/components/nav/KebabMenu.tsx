import { useState, useRef, useEffect } from "react";
import { IoEllipsisHorizontal, IoEllipsisVertical } from "react-icons/io5";

type MenuOption = {
  label: string;
  onClick: () => void;
};

type KebabMenuType = {
  type?: "V" | "H";
  size?: number;
  className?: string;
  options: MenuOption[];
};

export default function KebabMenu({
  type = "V",
  size = 20,
  className = "",
  options,
}: KebabMenuType) {
  const Icon = type === "H" ? IoEllipsisHorizontal : IoEllipsisVertical;
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <Icon
        size={size}
        className={`cursor-pointer ${className}`}
        onClick={() => setOpen((prev) => !prev)}
      />

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-zinc-800 shadow-lg z-50">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                option.onClick();
                setOpen(false);
              }}
              className="w-full text-left text-sm px-4 py-2 hover:bg-zinc-100 dark:hover:bg-black/30"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
