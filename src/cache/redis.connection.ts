
// import { config } from '@chats/config';
import { AppLogger } from '@chats/utils/logger';
import { RedisClient } from '@hiep20012003/joblance-shared';
import { config } from '@chats/config';

export class CacheStore extends RedisClient {

}

export const cacheStore = new CacheStore(config.REDIS_URL, AppLogger);
