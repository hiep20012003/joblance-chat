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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@chat/server");
const logger_1 = require("@chat/utils/logger");
const database_1 = require("./db/database");
class Application {
    constructor() {
        this.app = (0, express_1.default)();
        this.server = new server_1.ChatServer(this.app);
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const operation = 'app:init';
            try {
                yield database_1.database.connect();
                yield this.server.start();
                logger_1.AppLogger.info('Auth Service initialized', { operation });
            }
            catch (error) {
                logger_1.AppLogger.error('', { operation, error });
                process.exit(1);
            }
        });
    }
}
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const application = new Application();
        yield application.initialize();
    });
}
// ---- Global error handlers ---- //
process.on('uncaughtException', (error) => {
    logger_1.AppLogger.error('', { operation: 'app:uncaught-exception', error });
    process.exit(1);
});
process.on('unhandledRejection', (reason) => {
    logger_1.AppLogger.error('', { operation: 'app:unhandled-rejection', error: reason });
    process.exit(1);
});
// ---- App Entry Point ---- //
bootstrap().catch((error) => {
    logger_1.AppLogger.error('', { operation: 'app:bootstrap-failed', error });
    process.exit(1);
});
//# sourceMappingURL=app.js.map