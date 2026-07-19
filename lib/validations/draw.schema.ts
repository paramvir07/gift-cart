import { z } from "zod";

export const createDrawSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    description: z.string().trim().optional(),
    BannerImage: z.string().url("Must be a valid URL").optional(),
    entryAmount: z.number().min(0, "Entry amount must be at least 0"),
    priceMoney: z.number().min(0, "Prize money must be at least 0"),
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date(),
  })
  .refine((data) => data.endsAt > data.startsAt, {
    message: "endsAt must be after startsAt",
    path: ["endsAt"],
  });

export type CreateDrawInput = z.infer<typeof createDrawSchema>;
