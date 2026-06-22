import { z } from "zod";

const CursorSchema = z.object({
  id: z.number(),
  updated_at: z.date(),
});

export type Cursor = z.infer<typeof CursorSchema>;

export const encodeCursor = (cursor: Cursor): string => {
  return Buffer.from(JSON.stringify(cursor)).toString("base64url");
};

export const decodeCursor = (cursor: string): Cursor => {
  const decoded = JSON.parse(Buffer.from(cursor, "base64url").toString());

  console.log(decoded);
  console.log(typeof decoded.updated_at);

  return CursorSchema.parse({
    ...decoded,
    updated_at: new Date(decoded.updated_at),
  });
};
