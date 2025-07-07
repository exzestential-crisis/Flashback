"use client";

import { BaseModal, Spinner } from "@/components";
import Folder from "@/components/cards/Folder";
import { ComingSoon } from "@/components/empty";
import { useEffect, useState } from "react";

export default function FolderTab() {
  // ui
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [IsEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
          <div key={folder.folder_id} className="flex justify-center py-4">
            <Folder name={folder.name} colorId={folder.color_id} />
          </div>
        ))}
      </div>

      {/* Delete Modal */}
      <BaseModal
        isOpen={isDeleteModalOpen}
        cancelText="Delete"
        confirmText="Cancel"
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <h2 className="text-lg font-bold mb-2">Delete Folder?</h2>
        <div className="mb-6">
          <p className="font-semibold">
            Are you sure you want to delete this folder?
          </p>
          <p className="text-xs text-zinc-300">
            This will move the folder to your trash. You can restore or
            permanently delete it later from the Trash page.
          </p>
        </div>
      </BaseModal>
    </div>
  );
}
