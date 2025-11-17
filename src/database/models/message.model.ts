import mongoose, {Schema} from 'mongoose';
import {IMessageDocument, MessageType} from '@hiep20012003/joblance-shared';
import {v4 as uuidv4} from 'uuid';


const MessageSchema = new Schema<IMessageDocument>({
    _id: {
        type: String,
        default: () => uuidv4(),
        required: true,
    },
    conversationId: {
        type: String,
        ref: 'conversations',
        required: true,
    },
    senderId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
        maxlength: 5000,
    },
    type: {
        type: String,
        enum: Object.values(MessageType),
        default: MessageType.TEXT,
    },
    metadata: {type: Schema.Types.Mixed},
    attachments: {
        type: [Object],
        default: [],
    },
    read: {type: Boolean, default: false},
    readAt: {type: String, default: null},
    isDeleted: {
        type: Boolean,
        default: false,
    },
    timestamp: {
        type: String,
        default: () => new Date().toISOString(),
    },
}, {
    timestamps: false,
});

MessageSchema.index({conversationId: 1, timestamp: -1});

export const MessageModel = mongoose.model<IMessageDocument>('messages', MessageSchema);