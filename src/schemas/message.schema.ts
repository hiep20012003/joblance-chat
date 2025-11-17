import {z} from 'zod';
import {MessageType, parseObject, sanitizeNumber, sanitizeString} from '@hiep20012003/joblance-shared';

export const baseMessageSchema = z
    .object({
        _id: z.string().optional(),
        senderId: z.string().min(1, 'senderId is required'),
        content: z.string().max(5000).optional(),
        type: z.enum(MessageType).optional().default(MessageType.TEXT),
        metadata: z.record(z.string(), z.any()).optional(),
    })
    .superRefine((data, ctx) => {
        if (data.type !== MessageType.MEDIA && (!data.content || data.content.trim() === '')) {
            ctx.addIssue({
                code: 'custom',
                path: ['content'],
                message: 'content is required unless type is MEDIA',
            });
        }
    });

export const createMessageSchema = z.preprocess(parseObject, baseMessageSchema);


export const queryMessageSchema = z.object({
    lastTimestamp: sanitizeString(z.string()).optional(),
    limit: sanitizeNumber(z.number()).default(10),
});


export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type QueryMessageInput = z.infer<typeof queryMessageSchema>;
