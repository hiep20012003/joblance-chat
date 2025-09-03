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
exports.ChatServer = void 0;
const http_1 = __importDefault(require("http"));
const logger_1 = require("@chat/utils/logger");
const express_1 = require("express");
const joblance_shared_1 = require("@hiep20012003/joblance-shared");
const hpp_1 = __importDefault(require("hpp"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//import { Channel } from 'amqplib';
const socket_io_1 = require("socket.io");
const config_1 = require("@chat/config");
const routes_1 = require("./routes");
const SERVER_PORT = config_1.config.PORT || 4003;
//let chatChannel:Channel;
class ChatServer {
    constructor(app) {
        this.app = app;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.securityMiddleware(this.app);
            this.standarMiddleware(this.app);
            this.routesMiddleware(this.app);
            yield this.startQueues();
            this.startRedis();
            this.errorHandler(this.app);
            this.startServer(this.app);
        });
    }
    securityMiddleware(app) {
        app.set('trust proxy', 1);
        app.use((0, hpp_1.default)());
        app.use((0, helmet_1.default)());
        app.use((0, cors_1.default)({
            origin: config_1.config.API_GATEWAY_URL,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        }));
        app.use((req, _res, next) => {
            if (req.headers.authorization) {
                const token = req.headers.authorization.split(' ')[1];
                const payload = jsonwebtoken_1.default.decode(token);
                req.currentUser = payload;
            }
            next();
        });
    }
    standarMiddleware(app) {
        app.use((0, compression_1.default)());
        app.use((0, express_1.json)({ limit: '200mb' }));
        app.use((0, express_1.urlencoded)({ extended: true, limit: '200mb' }));
    }
    routesMiddleware(app) {
        (0, routes_1.appRoutes)(app);
    }
    startQueues() {
        return __awaiter(this, void 0, void 0, function* () {
            //this.chatChannel = (await createConnection()) as Channel;
        });
    }
    startRedis() {
        // cacheStore.connect();
    }
    errorHandler(app) {
        app.use((err, req, res, _next) => {
            const operation = 'server:handle-error';
            logger_1.AppLogger.error(`API ${req.originalUrl} unexpected error`, {
                req,
                operation,
                error: err instanceof joblance_shared_1.ApplicationError ? err.serialize() : {
                    name: err.name,
                    message: err.message,
                    stack: err.stack,
                }
            });
            if (err instanceof joblance_shared_1.ApplicationError) {
                new joblance_shared_1.ErrorResponse(Object.assign(Object.assign({}, err.serializeForClient()), { error: new RegExp('validate', 'i').test(err === null || err === void 0 ? void 0 : err.operation) ? err.context : undefined })).send(res);
            }
            else {
                const serverError = new joblance_shared_1.ServerError({
                    clientMessage: 'Internal server error',
                    cause: err,
                    operation
                });
                new joblance_shared_1.ErrorResponse(Object.assign({}, serverError.serializeForClient())).send(res);
            }
        });
        app.use('/*splat', (req, res, _next) => {
            const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
            const operation = 'server:route-not-found';
            const err = new joblance_shared_1.NotFoundError({
                clientMessage: `Endpoint not found: ${fullUrl}`,
                operation
            });
            logger_1.AppLogger.error(`API ${req.originalUrl} route not found`, {
                req,
                operation,
                error: err instanceof joblance_shared_1.ApplicationError ? err.serialize() : {
                    name: err.name,
                    message: err.message,
                    stack: err.stack,
                }
            });
            new joblance_shared_1.ErrorResponse(Object.assign({}, err.serializeForClient())).send(res);
        });
    }
    startServer(app) {
        try {
            const httpServer = new http_1.default.Server(app);
            this.startHttpServer(httpServer);
            this.createSocketIO(httpServer);
        }
        catch (error) {
            throw new joblance_shared_1.ServerError({
                clientMessage: 'Failed to start Chat Service server',
                cause: error,
                operation: 'server:error'
            });
        }
    }
    startHttpServer(httpServer) {
        try {
            logger_1.AppLogger.info(`Chat server started with process id ${process.pid}`, { operation: 'server:http-start' });
            httpServer.listen(SERVER_PORT, () => {
                logger_1.AppLogger.info(`Chat server is running on port ${SERVER_PORT}`, { operation: 'server:http-listening' });
            });
        }
        catch (error) {
            throw new joblance_shared_1.DependencyError({
                clientMessage: 'Failed to bind HTTP port',
                cause: error,
                operation: 'server:bind-error'
            });
        }
    }
    createSocketIO(httpServer) {
        this.socketIO = new socket_io_1.Server(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
            }
        });
        this.socketIO.on('connection', (socket) => {
            logger_1.AppLogger.info(`New socket connected: ${socket.id}`, { operation: 'socket:connection' });
            socket.on('disconnect', () => {
                logger_1.AppLogger.info(`Socket disconnected: ${socket.id}`, { operation: 'socket:disconnect' });
            });
        });
    }
}
exports.ChatServer = ChatServer;
//# sourceMappingURL=server.js.map