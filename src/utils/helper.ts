import {
    EXCHANGES, IChatMessageQueue,
    MessageQueueType,
    ROUTING_KEYS
} from '@hiep20012003/joblance-shared';
import {messageQueue, publishChannel} from '@chats/queues/connection';
import {AppLogger} from '@chats/utils/logger';


export const publishNewMessage = async (payload: Record<string, any>) => {
    const exchange = EXCHANGES.CHATS.name;
    const routingKey = ROUTING_KEYS.CHATS.MESSAGE_SENT;

    const message: IChatMessageQueue = {
        type: MessageQueueType.MESSAGE_SENT,
        actorId: payload.actorId,
        ...payload
    };

    await messageQueue.publish({
        channelName: publishChannel,
        exchange,
        routingKey,
        message: JSON.stringify(message)
    });

    AppLogger.info(`Published ${routingKey} to ${exchange} successfully`, {
        operation: 'queue:publish',
        context: {
            type: MessageQueueType.MESSAGE_SENT,
            status: 'published',
            exchange,
            routingKey
        }
    });
};

export const publishReadEvent = async (payload: Record<string, any>) => {
    const exchange = EXCHANGES.CHATS.name;
    const routingKey = ROUTING_KEYS.CHATS.MESSAGE_READ;

    const message: IChatMessageQueue = {
        type: MessageQueueType.MESSAGE_READ,
        actorId: payload.actorId,
        ...payload
    };

    await messageQueue.publish({
        channelName: publishChannel,
        exchange,
        routingKey,
        message: JSON.stringify(message)
    });

    AppLogger.info(`Published ${routingKey} to ${exchange} successfully`, {
        operation: 'queue:publish',
        context: {
            type: MessageQueueType.MESSAGE_SENT,
            status: 'published',
            exchange,
            routingKey
        }
    });
};