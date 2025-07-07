"use client";

import { BaseModal, Spinner } from "@/components";
import Deck from "@/components/cards/Deck";
import { useEffect, useState } from "react";

// API response type
type DeckApiType = {
  id: string;
  name: string;
  description: string;
  folder: {
    name: string;
    color_id: number;
  };
  card_count: number;
};

export default function DeckTab() {
  // ui
  const [decks, setDecks] = useState<DeckApiType[]>([]);
  const [loading, setLoading] = useState(true);
  const [IsEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // data
  useEffect(() => {
    async function fetchDecks() {
      try {
        const res = await fetch("/api/decks");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Something went wrong");
        }

        setDecks(json.decks);
      } catch (err) {
        console.error("failed to fetch decks: ", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDecks();
  }, []);

  const handleEdit = () => {};
  const handleDelete = () => {};

  if (loading) return <Spinner full />;

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {decks.map((deck: DeckApiType) => (
          <div key={deck.id} className="flex justify-center py-4">
            <Deck
              id={deck.id}
              name={deck.name}
              description={deck.description}
              folderName={deck.folder.name}
              cardCount={deck.card_count}
              colorId={deck.folder.color_id}
              onEdit={() => setIsEditModalOpen(true)}
              onDelete={() => setIsDeleteModalOpen(true)}
            />
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <BaseModal
        isOpen={IsEditModalOpen}
        confirmText="Save"
        onClose={() => setIsEditModalOpen(false)}
        onCancel={() => setIsEditModalOpen(false)}
      >
        <h2 className="text-lg font-bold mb-4">Edit Deck</h2>
        <div className="mb-4 space-y-4">
          <label
            className="block dark:text-zinc-300 text-sm font-semibold mb-1"
            htmlFor="title"
          >
            Title
          </label>
          <input
            className="
              appearance-none dark:bg-zinc-700 
              focus:ring-sky-700 focus:border-sky-700 focus:outline-none 
              p-2.5 rounded-lg w-full"
            id="title"
            type="text"
            placeholder="Deck Title"
          />
          <label
            className="block dark:text-zinc-300 text-sm font-semibold mb-1"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className="
              appearance-none dark:bg-zinc-700 
              focus:ring-sky-700 focus:border-sky-700 focus:outline-none 
              p-2.5 rounded-lg w-full mb-3"
            id="description"
            placeholder="Deck Description"
          ></textarea>
          <label
            className="block dark:text-zinc-300 text-sm font-semibold mb-1"
            htmlFor="folder"
          >
            Select Folder
          </label>
          <select
            id="folder"
            name="folder"
            className="
              appearance-none dark:bg-zinc-700 
              focus:ring-sky-700 focus:border-sky-700 focus:outline-none 
              p-2.5 rounded-lg w-full"
          >
            {decks &&
              decks.map((decks: any) => (
                <option key={decks.folder.name} value={decks.folder_id}>
                  {decks.folder.name}
                </option>
              ))}
          </select>
        </div>
      </BaseModal>

      {/* Delete Modal */}
      <BaseModal
        isOpen={isDeleteModalOpen}
        cancelText="Delete"
        confirmText="Cancel"
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <h2 className="text-lg font-bold mb-2">Delete Deck?</h2>
        <div className="mb-6">
          <p className="font-semibold">
            Are you sure you want to delete this deck?
          </p>
          <p className="text-xs text-zinc-300">
            This will move the deck to your trash. You can restore or
            permanently delete it later from the Trash page.
          </p>
        </div>
      </BaseModal>
    </div>
  );
}
