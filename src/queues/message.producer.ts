import { Channel } from 'amqplib';
import { AppLogger } from '@chat/utils/logger';
import { createConnection } from '@chat/queues/connection';

const publishDirectMessage = async (
  channel: Channel | undefined,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }

    await channel.assertExchange(exchangeName, 'direct');
    channel.publish(exchangeName, routingKey, Buffer.from(message));

    AppLogger.info(logMessage, { operation: 'publishDirectMessage' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      AppLogger.error(`ChatService publishDirectMessage() error: ${error.message}`, { operation: 'publishDirectMessage' });
    } else {
      AppLogger.error('ChatService publishDirectMessage() unknown error', { operation: 'publishDirectMessage', error });
    }
  }
};

export { publishDirectMessage };
