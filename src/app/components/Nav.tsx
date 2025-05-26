"use client";
import { useRouter } from "next/navigation";

export default function Nav() {
  const router = useRouter();

  const handleBrandClick = () => {
    router.push("/");
  };

  return (
    <div className="navbar fixed top-0 z-10 bg-white dark:bg-zinc-900 shadow-lg shadow-gray-100 dark:shadow-black/30 w-full lg:px-40">
      <div className="grid grid-cols-2 py-3 px-6">
        <div className="brand flex">
          <a
            className="flex items-center cursor-pointer"
            onClick={handleBrandClick}
          >
            <img
              src="http://placehold.co/100"
              alt="FlashBack"
              className="pe-5 w-20"
            />
            <h1 className="lg:text-2xl font-semibold text-zinc-700 dark:text-zinc-400">
              FlashBack
            </h1>
          </a>
        </div>
        <div className="flex items-center justify-end p-5">
          <a href="" className="text-md text-zinc-600 dark:text-zinc-400">
            About
          </a>
        </div>
      </div>
    </div>
  );
}
