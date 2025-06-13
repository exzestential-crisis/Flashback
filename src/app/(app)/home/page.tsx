"use client";

import { useState } from "react";
import { AnimatedTabPanel, Tabs } from "../components";
import { ComingSoon } from "@/components/empty";
import { DeckTab, FavouriteTab, FolderTab } from "./tabs";
export default function home() {
  // ui states
  const panels = [
    { key: "Decks", content: <DeckTab /> },
    { key: "Folders", content: <FolderTab /> },
    { key: "Favourites", content: <FavouriteTab /> },
    { key: "Statistics", content: <ComingSoon /> },
  ];
  const tabs = panels.map((panel) => panel.key);
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

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
      </div>
    </div>
  );
}
