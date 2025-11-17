import {IChatMessageQueue, MessageQueueType} from '@hiep20012003/joblance-shared';
import {AppLogger} from '@chats/utils/logger';
import {ChatsServer} from '@chats/server';

// import {cacheStore} from "@chats/cache/redis.connection";

export async function handleNewMessage<T extends Required<IChatMessageQueue>>(payload: T) {
    await Promise.resolve();
    const {
        type,
        message,
        actorId,
        conversation,
        readAt,
        readUpToMessageId
    } = payload;

    if (!conversation) {
        AppLogger.warn(`[Chat Consumer] Payload is invalid or missing conversationId.`, {operation: 'consumer:handler'});
        return;
    }

    // const senderId = message.senderId;
    const conversationId = conversation._id;
    // const recipientIds = conversation.participants.filter(value => value !== senderId);

    switch (type) {
        case MessageQueueType.MESSAGE_SENT: {
            if (!message) return;
            // 1. Phân phối Real-time: Gửi lệnh phân phối đến Gateway
            ChatsServer.getSocketIO().emit('message:send', conversationId, {conversation, message});
            // const currentViewingRoom = await cacheStore.get(`user:current_room:${recipientId}`);


            AppLogger.info(`✅ Dispatched new message (ID: ${message._id}) to Gateway for real-time delivery in conversation: ${conversationId}`, {
                operation: 'consumer:handler',
                context: {messageId: message._id}
            });

            // 2. Kích hoạt dịch vụ Thông báo
            // Ở đây, bạn cũng có thể kích hoạt Notification Service thông qua API/RPC
            // nếu tin nhắn yêu cầu xử lý thông báo (cho người dùng đang online nhưng không xem phòng chat).

            break;
        }
        case MessageQueueType.MESSAGE_READ: {
            if (!conversation) return;

            ChatsServer.getSocketIO().emit('message:read', conversationId, {
                conversation: conversation,
                readByUserId: actorId,
                readUpToMessageId: readUpToMessageId,
                readAt: readAt
            });

            AppLogger.info(`✅ Dispatched read event (ID: ${conversationId}) to Gateway for real-time delivery in conversation: ${conversationId}`, {
                operation: 'consumer:handler',
            });
            break;
        }
        default:
            AppLogger.warn(`[Chat Consumer Handler] Unhandled event type: ${type}`, {operation: 'consumer:handler'});
            break;
    }
}