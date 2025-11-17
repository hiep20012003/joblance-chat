

import { AppLogger } from '@chats/utils/logger';
import { EXCHANGES, MessageQueue } from '@hiep20012003/joblance-shared';
import { handleOrderOfferMessage } from '@chats/queues/handlers/order-offer.handler';

import { consumerChannel } from '../connection';

export async function consumeOrderOfferMessage(messageQueue: MessageQueue) {
  const exchange = EXCHANGES.CHATS.name;
  const queue = 'order.chats';

  await messageQueue.consume({
    channelName: consumerChannel,
    exchange,
    queue,
    handler: handleOrderOfferMessage,
    handlerRetryError: (operation: string, context)=>{
      AppLogger.error(
        `Exceeded max retries`,
        {
          operation,
          context
        }
      );
    },
    maxRetries: 5,
  });

  AppLogger.info('Orders message consumer listening to queue', {
    operation: 'consumer:init',
    context: { queue, exchange },
  });
}
