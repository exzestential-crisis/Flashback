"use client";

import Deck from "@/components/cards/Deck";
import { useEffect, useState } from "react";

export default function DeckTab() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDecks() {
      try {
        const res = await fetch(
          "/api/decks?sort_by=last_modified&sort_order=desc&limit=20&offset=0"
        );
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
  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {decks.map((deck: any) => (
          <div key={deck.id} className="flex justify-center py-4">
            <Deck
              name={deck.name}
              description={deck.description}
              folderName={deck.folder.name}
              cardCount={deck.card_count}
              colorId={deck.folder.color_id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
