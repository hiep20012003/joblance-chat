import {IOrderMessageQueue, MessageQueueType} from '@hiep20012003/joblance-shared';
import {AppLogger} from '@chats/utils/logger';

// import { messageService } from '@chats/services/message.service';

export async function handleOrderOfferMessage<T extends Required<IOrderMessageQueue>>(payload: T): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const {
        type,

        isCustomOffer
    } = payload;
    switch (type) {
        case MessageQueueType.CUSTOM_OFFER_ACCEPTED: {
            if (!isCustomOffer) break;
            // const data = {
            //   gigId,
            //   buyerId,
            //   sellerId,
            //   orderId,
            // };
            // await messageService.acceptCustomOffer(notification.actor.id, data);
            break;
        }
        default:
            AppLogger.warn(`[Order Order Handler] Unhandled event type: ${type}`, {operation: 'consumer:handler'});
            break;
    }
}

