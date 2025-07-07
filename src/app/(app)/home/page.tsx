"use client";

import { useState } from "react";
import { AnimatedTabPanel, Tabs } from "../components";
import { ComingSoon } from "@/components/empty";
import { DeckTab, FavouriteTab, FolderTab } from "./tabs";
import { FAButton } from "@/components";
import { FaFolderOpen } from "react-icons/fa";
import { PiCardsThreeFill } from "react-icons/pi";
import { TbCardsFilled } from "react-icons/tb";

// Floating Menu Component
type FloatingMenuProps = {
  isOpen: boolean;
  menuItems: { label: string; icon: React.ElementType; onClick: () => void }[];
};

const FloatingMenu = ({ isOpen, menuItems }: FloatingMenuProps) => {
  return (
    <div
      className={`absolute bottom-24 right-0 w-48 flex flex-col items-end space-y-3 transition-all duration-300 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {menuItems.map((item, index) => (
        <div
          key={item.label}
          className={`
          w-full transition-all duration-300
          ${
            isOpen
              ? `opacity-100 translate-y-0 delay-${300 - index * 100}`
              : "opacity-0 translate-y-4 delay-0"
          }
        `}
        >
          <button
            className="
            dark:bg-zinc-700 text-white w-full flex py-3 px-4 items-center justify-between rounded-md shadow
            transition-colors duration-200 hover:bg-zinc-800
          "
            onClick={item.onClick}
          >
            {item.label}
            <item.icon className="text-white text-2xl ml-3" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default function home() {
  // ui states
  const panels = [
    { key: "Decks", content: <DeckTab /> },
    { key: "Folders", content: <FolderTab /> },
    { key: "Favourites", content: <FavouriteTab /> },
  ];
  const tabs = panels.map((panel) => panel.key);
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  // Menu items configuration
  const menuItems = [
    {
      label: "Create Folder",
      icon: FaFolderOpen,
      onClick: () => {
        // Add your folder creation logic here
        console.log("Create Folder clicked");
      },
    },
    {
      label: "Create Deck",
      icon: PiCardsThreeFill,
      onClick: () => {
        // Add your deck creation logic here
        console.log("Create Deck clicked");
      },
    },
    {
      label: "Create Card",
      icon: TbCardsFilled,
      onClick: () => {
        // Add your card creation logic here
        console.log("Create Card clicked");
      },
    },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setActiveIndex(tabs.indexOf(tab));
        }}
      />
      <div className="flex-1">
        <AnimatedTabPanel panels={panels} activeIndex={activeIndex} />

        <div className="fixed bottom-10 right-10 z-50">
          {/* Floating Action Button */}
          <FAButton onClick={handleToggle} />

          {/* Cascading Menu */}
          <FloatingMenu isOpen={isOpen} menuItems={menuItems} />
        </div>
      </div>
    </div>
  );
}
