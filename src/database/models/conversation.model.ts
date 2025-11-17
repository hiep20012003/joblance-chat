import mongoose, {Schema} from 'mongoose';
import {IConversationDocument} from '@hiep20012003/joblance-shared';
import {v4 as uuidv4} from 'uuid';

const ConversationSchema = new Schema<IConversationDocument>({
    _id: {
        type: String,
        default: () => uuidv4(),
        required: true,
    },
    participants: {
        type: [{type: String}],
        required: true,
        validate: [
            (val: string[]) => val.length === 2,
            'Conversation must have exactly two participants.'
        ],
    },
    lastMessage: {
        type: {
            _id: {type: String, ref: 'messages'},
            content: {type: String},
            senderId: {type: String},
            timestamp: {type: String},
        },
        required: false,
    },
    unreadCounts: {
        type: Map,
        of: Number,
        default: () => new Map<string, number>(),
    },
    isArchived: {
        type: Map,
        of: Boolean,
        default: {},
    },
}, {
    timestamps: true
});

ConversationSchema.index({updatedAt: -1});
ConversationSchema.index(
    {'participants.0': 1, 'participants.1': 1},
    {unique: true});
ConversationSchema.pre('validate', function (next) {
    if (Array.isArray(this.participants) && this.participants.length === 2) {
        this.participants.sort();
    }
    next();
});

export const ConversationModel = mongoose.model<IConversationDocument>('conversations', ConversationSchema);