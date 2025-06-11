import { z } from "zod";

export const ColorModel = z.object({
  color_id: z.number().int(),
  name: z.string(),
  hex_code: z.string(),
});

export type Color = z.infer<typeof ColorModel>;
