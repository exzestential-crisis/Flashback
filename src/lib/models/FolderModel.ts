// lib/models/FolderModel.ts

import { z } from "zod";
import { DeckWithCardsModel } from "./DeckModel";

export const FolderModel = z.object({
  folder_id: z.number().int(),
  user_id: z.string().uuid(),
  name: z.string(),
  created_at: z.coerce.date(),
  last_modified: z.coerce.date(),
  is_favorite: z.boolean(),
  color_id: z.number().int(),
});

// Updated to include the decks array
export const FolderWithDecksModel = FolderModel.extend({
  deck_count: z.number().int().default(0),
  decks: z.array(DeckWithCardsModel).default([]),
});

export type Folder = z.infer<typeof FolderModel>;
export type FolderWithDecks = z.infer<typeof FolderWithDecksModel>;
