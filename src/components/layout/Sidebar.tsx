"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BiSidebar } from "react-icons/bi";
import { FaBell, FaHome, FaPlay, FaPlus, FaUser } from "react-icons/fa";
import { FaEarthAmericas, FaGear } from "react-icons/fa6";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const tabs = [
    { name: "Home", icon: FaHome, link: "/home" },
    { name: "Discover", icon: FaEarthAmericas, link: "/discover" },
    { name: "Create", icon: FaPlus, link: "/create" },
    { name: "Notifications", icon: FaBell, link: "/notifications" },
    { name: "Profile", icon: FaUser, link: "/profile" },
  ];
  return (
    <div className="sidebar flex">
      <div
        className={`
          relative flex flex-col
          dark:bg-zinc-800
          border-e-2 p-4 dark:border-zinc-800
          h-screen overflow-hidden
          transition-[width]
          duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-64"}
      `}
      >
        {/* Brand + Collapse button */}
        <div className="brand flex items-center">
          <Link
            className={`
              flex items-center
              cursor-pointer
              transition-all duration-300
              ${
                collapsed
                  ? "opacity-0 translate-x-[-10px] pointer-events-none"
                  : "opacity-100 translate-x-0"
              }
              `}
            href={"/"}
          >
            <img
              src="http://placehold.co/50"
              className="pe-4 h-12"
              alt="Flashback"
            />
            <h1 className="text-2xl font-bold">FlashBack</h1>
          </Link>
          <div className="flex items-center h-14">
            <button
              className={`
              absolute right-6 top-7 cursor-pointer
              ${collapsed ? "mx-auto" : "ms-auto"}
              `}
              onClick={() => setCollapsed(!collapsed)}
            >
              <BiSidebar className="h-8 w-8 text-zinc-400" />
            </button>
          </div>
        </div>

        <hr className="my-4 dark:text-zinc-400" />

        {/* Tabs */}
        <div className="tabs flex flex-col flex-grow">
          <div className="space-y-2 flex-grow">
            {tabs.map((tab, index) => (
              <SidebarTab
                key={index}
                icon={tab.icon}
                name={tab.name}
                link={tab.link}
                collapsed={collapsed}
              />
            ))}
          </div>

          <SidebarTab
            icon={FaGear}
            name="Settings"
            link="/settings"
            collapsed={collapsed}
            classname="mt-auto"
          />
        </div>
      </div>
    </div>
  );
}

type SidebarTabType = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  name: string;
  link: string;
  collapsed: boolean;
  classname?: string;
};

const SidebarTab = ({
  icon: Icon,
  name,
  link,
  collapsed,
  classname = "",
}: SidebarTabType) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <Link
      className={`
      relative flex items-center
      h-10 px-3
      rounded-lg
      hover:bg-zinc-200 dark:hover:bg-zinc-900
      transition-colors duration-300
      cursor-pointer
      ${classname}
      ${
        isActive
          ? "bg-sky-500 dark:bg-sky-600 text-white pointer-events-none"
          : ""
      }
    `}
      href={link}
    >
      <div className="flex justify-center items-center w-5 h-5 z-10">
        <Icon
          className={`
          w-full h-full
          ${isActive ? "text-white" : "text-zinc-400"}
        `}
        />
      </div>

      <span
        className={`
          absolute left-12 
          transition-all duration-300 
          whitespace-nowrap 
          text-sm z-0 
          ${
            collapsed
              ? "opacity-0 translate-x-[-10px] pointer-events-none"
              : "opacity-100 translate-x-0"
          }`}
      >
        {name}
      </span>
    </Link>
  );
};
