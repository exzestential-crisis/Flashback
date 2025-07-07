// lib/models/DeckModel.ts

import { z } from "zod";

export const DeckModel = z.object({
  deck_id: z.number().int(),
  user_id: z.string().uuid(),
  folder_id: z.number().int(),
  folder_name: z.string(),
  name: z.string(),
  description: z.string(),
  created_at: z.coerce.date(),
  last_modified: z.coerce.date(),
  last_studied: z.coerce.date().nullable(),
  is_favorite: z.boolean(),
  is_public: z.boolean(),
  is_deleted: z.boolean(),
  deleted_at: z.coerce.date().nullable(),
  color_id: z.number().int(),
});

// added card_count
export const DeckWithCardsModel = DeckModel.extend({
  card_count: z.number().int().default(0),
});

export type Deck = z.infer<typeof DeckModel>;
export type DeckWithCards = z.infer<typeof DeckWithCardsModel>;
