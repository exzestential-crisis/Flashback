import { z } from "zod";

export const FolderModel = z.object({
  folder_id: z.number().int(),
  user_id: z.string().uuid(),
  name: z.string(),
  created_at: z.coerce.date(),
  last_modified: z.coerce.date(),
  is_favorite: z.boolean(),
  color_id: z.number().int(),
});

// added deck_count
export const FolderWithDecksModel = FolderModel.extend({
  deck_count: z.number().int().default(0),
});

export type Folder = z.infer<typeof FolderModel>;
export type FolderWithDecks = z.infer<typeof FolderWithDecksModel>;
