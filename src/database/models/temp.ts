import mongoose, {Schema} from 'mongoose';
import {IMessageDocument, MessageType} from '@hiep20012003/joblance-shared';


const MessageSchema: Schema = new Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
    metadata: {type: Schema.Types.Mixed, default: null},
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: {createdAt: 'timestamp', updatedAt: false}
});

MessageSchema.index({conversationId: 1, timestamp: -1});

export const MessageModel = mongoose.model<IMessageDocument>('messages', MessageSchema);