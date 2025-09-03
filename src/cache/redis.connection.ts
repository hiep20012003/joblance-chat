
import { config } from '@chat/config';
import { AppLogger } from '@chat/utils/logger';
import { RedisClient } from '@hiep20012003/joblance-shared';

export class CacheStore extends RedisClient {

}

export const cacheStore = new CacheStore(config.REDIS_HOST, AppLogger);
