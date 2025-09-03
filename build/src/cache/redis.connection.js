"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheStore = exports.CacheStore = void 0;
const config_1 = require("@chat/config");
const logger_1 = require("@chat/utils/logger");
const joblance_shared_1 = require("@hiep20012003/joblance-shared");
class CacheStore extends joblance_shared_1.RedisClient {
}
exports.CacheStore = CacheStore;
exports.cacheStore = new CacheStore(config_1.config.REDIS_HOST, logger_1.AppLogger);
//# sourceMappingURL=redis.connection.js.map