import { z } from 'zod';

export const messageSchema = z.object({
  id: z.number().or(z.string()).optional(),
  ttl: z.coerce.number().int().positive().finite().safe(),
  text: z.string(),
  isExpired: z.union([z.literal('0'), z.literal('1')]).optional(),
});

export type MessageDTO = z.infer<typeof messageSchema>;
