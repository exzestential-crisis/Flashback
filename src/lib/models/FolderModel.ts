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

export type Folder = z.infer<typeof FolderModel>;
