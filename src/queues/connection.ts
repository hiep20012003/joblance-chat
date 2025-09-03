import { config } from '@chat/config';
import { AppLogger } from '@chat/utils/logger';
import { MessageQueue } from '@hiep20012003/joblance-shared';
import { connect, Channel, Connection } from 'amqplib';

export const messageQueue = MessageQueue.getInstance(`${config.RABBITMQ_ENDPOINT}`);
export const publishChannel: string = 'auth-publish-channel';
export const consumerChannel: string = 'auth-consumer-channel';

let isCloseListenerSet = false;

export async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await connect(`${config.RABBITMQ_ENDPOINT}`); 
    const channel: Channel = await connection.createChannel();

    AppLogger.info('Chat server connected to queue successfully...', { operation: 'queue:connect' });

    if (!isCloseListenerSet) {
      setupCloseListener(channel, connection);
      isCloseListenerSet = true;
    }

    return channel;
  } catch (error: unknown) {
    if (error instanceof Error) {
      AppLogger.error(`ChatService createConnection() method error: ${error.message}`, { operation: 'queue:createConnection' });
    } else {
      AppLogger.error('ChatService createConnection() unknown error', { operation: 'queue:createConnection', error });
    }
    return undefined;
  }
}

function setupCloseListener(channel: Channel, connection: Connection): void {
  process.once('SIGINT', () => {
    void (async () => {
      try {
        await channel.close();
        await connection.close();
        AppLogger.info('RabbitMQ channel and connection closed due to SIGINT', { operation: 'queue:close' });
      } catch (error: unknown) {
        if (error instanceof Error) {
          AppLogger.error(`Error closing RabbitMQ: ${error.message}`, { operation: 'queue:close' });
        } else {
          AppLogger.error('Unknown error while closing RabbitMQ', { operation: 'queue:close', error });
        }
      } finally {
        process.exit(0);
      }
    })(); 
  });
}

export async function initQueue() {
  try {
    await messageQueue.connect();
    AppLogger.info('RabbitMQ connection established successfully', { operation: 'queue:connect' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      AppLogger.error(`Failed to initialize RabbitMQ: ${error.message}`, { operation: 'queue:initQueue' });
    } else {
      AppLogger.error('Unknown error while initializing RabbitMQ', { operation: 'queue:initQueue', error });
    }
  }
}
