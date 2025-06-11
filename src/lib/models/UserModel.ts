import { z } from "zod";

const UserModel = z.object({
  user_id: z.string().uuid(),
  auth_id: z.string().uuid(),
  username: z.string().min(1).max(50),
  email: z.string().email(),
  created_at: z.date(),
  theme_preference: z.enum(["light", "dark", "auto"]),
  last_login: z.date().nullable(),
  user_type: z.enum(["student", "teacher", "other"]),
  school_id: z.number().int().positive().nullable(),
  interests: z.array(z.string()),
});

export type User = z.infer<typeof UserModel>;
