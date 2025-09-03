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
exports.publishDirectMessage = void 0;
const config_1 = require("@chat/config");
const jobber_shared_1 = require("@hiep20012003/jobber-shared");
const connection_1 = require("@chat/queues/connection");
const log = (0, jobber_shared_1.winstonLogger)(`${config_1.config.ELASTIC_SEARCH_URL}`, 'chatServiceProducer', 'debug');
const publishDirectMessage = (channel, exchangeName, routingKey, message, logMessage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!channel) {
            channel = (yield (0, connection_1.createConnection)());
        }
        yield channel.assertExchange(exchangeName, 'direct');
        channel.publish(exchangeName, routingKey, Buffer.from(message));
        log.info(logMessage);
    }
    catch (error) {
        log.log('error', 'ChatService publishDirectMessage() method error:', error);
    }
});
exports.publishDirectMessage = publishDirectMessage;
//# sourceMappingURL=message.producer.js.map