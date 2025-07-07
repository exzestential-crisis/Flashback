"use client";

import { Spinner } from "@/components";
import Folder from "@/components/cards/Folder";
import { ComingSoon } from "@/components/empty";
import { useEffect, useState } from "react";

export default function FolderTab() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFolders() {
      try {
        const res = await fetch("/api/folders");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Something went wrong");
        }

        setFolders(json.folders);
      } catch (err) {
        console.log("failed to fetch: ", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFolders();
  }, []);

  if (loading) return <Spinner full />;

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {folders.map((folder: any) => (
          <div key={folder.id} className="flex justify-center py-4">
            <Folder name={folder.name} colorId={folder.color_id} />
          </div>
        ))}
      </div>
    </div>
  );
}
