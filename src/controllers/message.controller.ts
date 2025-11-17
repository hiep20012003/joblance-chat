import {Request, Response} from 'express';
import {IMessageDocument, SuccessResponse} from '@hiep20012003/joblance-shared';
import {ReasonPhrases, StatusCodes} from 'http-status-codes';
import {messageService} from '@chats/services/message.service';
import {CreateConversationInput, QueryConversationInput} from '@chats/schemas/conversation.schema';
import {CreateMessageInput, QueryMessageInput} from '@chats/schemas/message.schema';

export class MessageController {

    createConversation = async (req: Request, res: Response): Promise<void> => {
        const conversation = await messageService.createConversation(req.body as CreateConversationInput, req.file);
        new SuccessResponse({
            statusCode: StatusCodes.OK,
            reasonPhrase: ReasonPhrases.OK,
            data: conversation
        }).send(res);
    };

    createMessage = async (req: Request, res: Response): Promise<void> => {
        const conversation = await messageService.createMessage(req.params.conversationId, req.body as CreateMessageInput, req.file);
        new SuccessResponse({
            statusCode: StatusCodes.OK,
            reasonPhrase: ReasonPhrases.OK,
            data: conversation
        }).send(res);
    };

    getConversationById = async (req: Request, res: Response): Promise<void> => {
        const conversation = await messageService.getConversationById(req.params.conversationId);
        new SuccessResponse({
            statusCode: StatusCodes.OK,
            reasonPhrase: ReasonPhrases.OK,
            data: conversation
        }).send(res);
    };

    // // get
    getCurrentUserConversations = async (req: Request, res: Response): Promise<void> => {
        const query = req.validatedQuery as QueryConversationInput;
        const conversations = await messageService.getCurrentUserConversations(req.currentUser?.sub, query);
        new SuccessResponse({
            statusCode: StatusCodes.OK,
            reasonPhrase: ReasonPhrases.OK,
            data: conversations
        }).send(res);
    };

    readConversationMessages = async (req: Request, res: Response): Promise<void> => {
        const result = await messageService.readConversationMessages(req.currentUser?.sub, req.params.conversationId);
        new SuccessResponse({
            statusCode: StatusCodes.OK,
            reasonPhrase: ReasonPhrases.OK,
            data: result
        }).send(res);
    };

    getMessagesInConversation = async (req: Request, res: Response): Promise<void> => {
        const {conversationId} = req.params;
        const query = req.validatedQuery as QueryMessageInput;
        const messages: IMessageDocument[] = await messageService.getMessagesInConversation(
            req.currentUser?.sub, conversationId, query
        );
        new SuccessResponse({
            statusCode: StatusCodes.OK,
            reasonPhrase: ReasonPhrases.OK,
            data: messages
        }).send(res);
    };

}

export const messageController: MessageController = new MessageController();
