import {z} from 'zod';
import {parseArray, parseObject, sanitizeNumber, sanitizeString} from '@hiep20012003/joblance-shared';
import {baseMessageSchema} from '@chats/schemas/message.schema';

export const createConversationSchema = z.object({
    participants: z.preprocess(parseArray, z.array(z.string()).length(2)),
    message: z.preprocess(parseObject, baseMessageSchema),
});


export const queryConversationSchema = z.object({
    lastTimestamp: sanitizeString(z.string()).optional(),
    limit: sanitizeNumber(z.number()).optional(),
});


export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type QueryConversationInput = z.infer<typeof queryConversationSchema>;