"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumerChannel = exports.publishChannel = exports.messageQueue = void 0;
exports.initQueue = initQueue;
const config_1 = require("@chat/config");
const logger_1 = require("@chat/utils/logger");
const joblance_shared_1 = require("@hiep20012003/joblance-shared");
exports.messageQueue = joblance_shared_1.MessageQueue.getInstance(`${config_1.config.RABBITMQ_ENDPOINT}`);
exports.publishChannel = 'auth-publish-channel';
exports.consumerChannel = 'auth-consumer-channel';
function initQueue() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.messageQueue.connect();
        logger_1.AppLogger.info('RabbitMQ connection established successfully', { operation: 'queue:connect' });
    });
}
//# sourceMappingURL=connection.js.map