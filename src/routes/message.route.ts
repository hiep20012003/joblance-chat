import {messageController} from '@chats/controllers/message.controller';
import {
    ALL_CHAT_FILE_ALLOWED_MIMES,
    handleAsyncError,
    validateFile,
    validate,
    validateQueryMiddleware
} from '@hiep20012003/joblance-shared';
import express, {Router} from 'express';
import multer from 'multer';
import {createConversationSchema, queryConversationSchema} from '@chats/schemas/conversation.schema';
import {createMessageSchema, queryMessageSchema} from '@chats/schemas/message.schema';

class MessageRoutes {
    private readonly router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        const upload = multer({storage: multer.memoryStorage()});

        this.router.post(
            '/conversations',
            upload.single('attachment'),
            validateFile(ALL_CHAT_FILE_ALLOWED_MIMES),
            validate(createConversationSchema),
            handleAsyncError(messageController.createConversation)
        );
        this.router.post(
            '/conversations/:conversationId/messages',
            upload.single('attachment'),
            validateFile(ALL_CHAT_FILE_ALLOWED_MIMES),
            validate(createMessageSchema),
            handleAsyncError(messageController.createMessage)
        );
        this.router.get(
            '/conversations',
            validateQueryMiddleware(queryConversationSchema),
            handleAsyncError(messageController.getCurrentUserConversations)
        );
        this.router.get(
            '/conversations/:conversationId',
            handleAsyncError(messageController.getConversationById)
        );
        this.router.get(
            '/conversations/:conversationId/messages',
            validateQueryMiddleware(queryMessageSchema),
            handleAsyncError(messageController.getMessagesInConversation)
        );
        this.router.post(
            '/conversations/:conversationId/read',
            handleAsyncError(messageController.readConversationMessages)
        );

        return this.router;
    }
}

export const messageRoutes: MessageRoutes = new MessageRoutes();
