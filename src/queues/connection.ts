import {config} from '@chats/config';
import {AppLogger} from '@chats/utils/logger';
import {MessageQueue, setupAllQueues} from '@hiep20012003/joblance-shared';
// import {consumeOrderOfferMessage} from '@chats/queues/consumers/order-offer.consumer';
import {consumeNewMessage} from '@chats/queues/consumers/message.consumer';

export const messageQueue = MessageQueue.getInstance(`${config.RABBITMQ_URL}`);
export const publishChannel: string = 'chat-publish-channel';
export const consumerChannel: string = 'chat-consumer-channel';

export async function initQueue() {
    await messageQueue.connect();
    AppLogger.info('RabbitMQ connection established successfully', {operation: 'queue:connect'});
    await setupAllQueues(messageQueue, (error: Error, queueName?: string) => {
        AppLogger.error(
            `[Setup] Failed to setup queue${queueName ? ` "${queueName}"` : ''}`,
            {
                operation: 'queue:setup-all',
                error: error,
            }
        );
    });

    // await consumeOrderOfferMessage(messageQueue);
    await consumeNewMessage(messageQueue);
}
