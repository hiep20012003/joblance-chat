import crypto from 'crypto';

import {ConversationModel} from '@chats/database/models/conversation.model';
import {MessageModel} from '@chats/database/models/message.model';
import {
    uploadCloudinary,
    UploadFileError,
    runInTransaction,
    MessageType,
    IConversationDocument,
    IMessageDocument
} from '@hiep20012003/joblance-shared';
import {AppLogger} from '@chats/utils/logger';
import {database} from '@chats/database/connection';
import {CreateConversationInput, QueryConversationInput} from '@chats/schemas/conversation.schema';
import {CreateMessageInput, QueryMessageInput} from '@chats/schemas/message.schema';
import {v4 as uuidv4} from 'uuid';
import {publishNewMessage, publishReadEvent} from '@chats/utils/helper';

class MessageService {

    // Tạo conversation mới nếu chưa có
    createConversation = async (payload: CreateConversationInput, file?: Express.Multer.File) => {
        return runInTransaction(await database.getConnection(), async (session) => {
            let isNew = true;
            let conversation = await ConversationModel.findOne({
                participants: {$all: payload.participants, $size: payload.participants.length}
            }).session(session);


            if (conversation) {
                isNew = false;
                AppLogger.warn('Conversation already exists.', {operation: 'chat:create-conversation'});
            } else {
                conversation = (await ConversationModel.create([{
                    _id: uuidv4(),
                    participants: payload.participants,
                }], {session}))[0];
            }

            // --- Logic Upload File ---
            let uploadedFile;
            let message: IMessageDocument | null = null;
            if (payload.message) {
                const messageData = payload.message;
                if (messageData.type === MessageType.MEDIA && file) {
                    const randomBytes: Buffer = crypto.randomBytes(20);
                    const randomCharacters: string = randomBytes.toString('hex');
                    uploadedFile = await uploadCloudinary({
                        file,
                        publicId: randomCharacters,
                        resourceType: 'auto',
                        folder: 'joblance/chats',
                        downloadable: true
                    });
                    if (!uploadedFile.publicId) {
                        throw new UploadFileError({
                            clientMessage: 'Upload file error',
                            operation: 'message:upload-file',
                            context: {filename: file.originalname}
                        });
                    }
                }

                // Tạo message
                message = (await MessageModel.create([{
                    conversationId: conversation._id,
                    ...messageData,
                    content: uploadedFile?.secureUrl ? '📎 Attachment' : messageData.content,
                    attachments: uploadedFile ? [uploadedFile] : undefined
                }], {session}))[0];

                conversation.set('lastMessage', {
                    _id: message._id,
                    content: messageData.type === MessageType.MEDIA ? '📎 Attachment' : message.content,
                    senderId: message.senderId,
                    timestamp: message.timestamp, // Sử dụng kiểu Date/String tương ứng
                });

                conversation.participants.forEach((userId) => {
                    if (userId !== message?.senderId) {
                        const currentCount = (conversation.unreadCounts as Map<string, number>).get(userId) || 0;
                        (conversation.unreadCounts as Map<string, number>).set(userId, currentCount + 1);
                        conversation.markModified('unreadCounts');
                    }
                });

                await conversation.save({session});

                // Emit socket
                await publishNewMessage({message, conversation, isNewConversation: isNew, actorId: message?.senderId});
                // ChatsServer.getSocketIO().emit('message:send', conversation._id, {...message,});
            }

            return {conversation, message};
        });
    };

    // Tạo message trong conversation
    createMessage = async (
        conversationId: string,
        payload: CreateMessageInput,
        file?: Express.Multer.File,
    ) => {
        return runInTransaction(await database.getConnection(), async (session) => {
            const conversation = await ConversationModel.findById(conversationId).session(session);
            if (!conversation) {
                throw new Error('Conversation not found');
            }
            if (!conversation.participants.includes(payload.senderId)) {
                throw new Error('Sender is not a participant of the conversation');
            }

            // --- Logic Upload File ---
            let uploadedFile;
            if (payload.type === MessageType.MEDIA && file) {
                const randomBytes: Buffer = crypto.randomBytes(20);
                const randomCharacters: string = randomBytes.toString('hex');
                uploadedFile = await uploadCloudinary({
                    file,
                    publicId: randomCharacters,
                    resourceType: 'auto',
                    folder: 'joblance/chats',
                    downloadable: true
                });
                if (!uploadedFile.publicId) {
                    throw new UploadFileError({
                        clientMessage: 'Upload file error',
                        operation: 'message:upload-file',
                        context: {filename: file.originalname}
                    });
                }
            }

            // Tạo message
            const message = (await MessageModel.create([{
                conversationId,
                ...payload,
                content: uploadedFile?.secureUrl ?? payload.content,
                attachments: uploadedFile ? [uploadedFile] : undefined
            }], {session}))[0];

            // Cập nhật lastMessage SỬ DỤNG .set() để đảm bảo Mongoose nhận biết thay đổi
            conversation.set('lastMessage', {
                _id: message._id,
                content: message.type === MessageType.MEDIA ? '📎 Attachment' : message.content,
                senderId: message.senderId,
                timestamp: message.timestamp, // Sử dụng kiểu Date/String tương ứng
            });

            // Tăng unreadCounts cho participant khác
            conversation.participants.forEach((userId) => {
                if (userId !== message.senderId) {
                    const currentCount = (conversation.unreadCounts as Map<string, number>).get(userId) || 0;
                    (conversation.unreadCounts as Map<string, number>).set(userId, currentCount + 1);
                    // Dùng markModified để đảm bảo Mongoose nhận biết thay đổi trên Map
                    conversation.markModified('unreadCounts');
                }
            });

            await conversation.save({session});

            // Emit socket
            await publishNewMessage({message, conversation, actorId: message.senderId});
            // ChatsServer.getSocketIO().emit('message:send', conversationId, message);

            return {message, conversation};
        });
    };

    // Lấy conversation theo ID
    getConversationById = async (conversationId: string): Promise<IConversationDocument | null> => {
        return ConversationModel.findById(conversationId).lean();
    };

    // Lấy tất cả conversation của user, sắp xếp theo lastMessage/updatedAt
    getCurrentUserConversations = async (
        userId: string | undefined,
        query: QueryConversationInput
    ): Promise<IConversationDocument[] | null> => {
        if (!userId) return [];

        const {lastTimestamp, limit = 0} = query;

        const filter: Record<string, unknown> = {
            participants: userId,
        };

        if (lastTimestamp) {
            filter['lastMessage.timestamp'] = {$lt: (new Date(lastTimestamp)).toISOString()};
        }

        return ConversationModel.find(filter)
            .sort({'lastMessage.timestamp': -1, updatedAt: -1}) // Ưu tiên hội thoại mới nhất
            .limit(limit)
            .lean();
    };


    // Đánh dấu tin nhắn trong conversation đã đọc cho user
    readConversationMessages = async (userId: string | undefined, conversationId: string) => {
        if (!userId) return;

        return runInTransaction(await database.getConnection(), async (session) => {
            // Tối ưu: Chỉ cần tìm Conversation ID và kiểm tra participant, không cần load toàn bộ document
            const conversation = await ConversationModel.findOne({
                _id: conversationId,
                participants: {$in: [userId]}
            }).session(session);

            if (!conversation) return;

            const readAt = new Date().toISOString();

            // Update messages read status
            await MessageModel.updateMany(
                {conversationId, senderId: {$ne: userId}},
                {$set: {read: true, readAt: readAt}}
            ).session(session);

            // Reset unreadCounts cho user
            (conversation.unreadCounts as Map<string, number>).set(userId, 0);
            conversation.markModified('unreadCounts'); // Bắt buộc phải có khi thao tác với Map
            await conversation.save({session});

            // Notify client
            await publishReadEvent({
                actorId: userId,
                conversation: conversation,
                readUpToMessageId: conversation.lastMessage?._id,
                readAt: readAt
            });

            return {
                conversation: conversation.toJSON(), readAt: readAt,
            };
        });
    };

    // Lấy tin nhắn trong conversation, hỗ trợ phân trang theo lastTimestamp
    getMessagesInConversation = async (
        userId: string | undefined,
        conversationId: string,
        query: QueryMessageInput,
    ): Promise<IMessageDocument[]> => {
        if (!userId) return [];

        const conversation = await ConversationModel.findOne({
            _id: conversationId,
            participants: {$in: [userId]},
        });

        if (!conversation) return [];

        const filter: Record<string, unknown> = {conversationId};
        if (query?.lastTimestamp) {
            filter.timestamp = {$lt: (new Date(query.lastTimestamp)).toISOString()};
        }

        console.log(filter);

        const messages = await MessageModel.find(filter)
            .sort({timestamp: -1})
            .limit(query.limit)
            .lean();

        return messages;
    };

}

export const messageService = new MessageService();
