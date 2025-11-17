// microservices/joblance-gateway/src/sockets/sockets.ts
import http from 'http';

import { Server, Socket, Namespace } from 'socket.io';
import { AppLogger } from '@chats/utils/logger';

export class ChatsSocket {
  private readonly io: Server;
  private readonly chatsNamespace: Namespace;

  constructor(httpServer: http.Server) {
    this.io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      },
    });
    this.chatsNamespace = this.io.of('/chats');
  }

  public listen() {
    this.handleClientConnections();
  }

  private handleClientConnections(): void {
    this.chatsNamespace.on('connection', (socket: Socket) => {
      AppLogger.info('Gateway Socket connected', { operation: 'socket:gateway-connect', context: { socketId: socket.id } });

      socket.on('disconnect', () => {
        AppLogger.info(`Socket disconnected: ${socket.id}`, { operation: 'socket:gateway-disconnect', context: { socketId: socket.id } });
      });

      socket.on('error', (err) => {
        AppLogger.error('Socket error', {
          operation: 'socket:error',
          context: { socketId: socket.id, error: err }
        });
      });
    });
  }

  public emit(event: string, ...args: unknown[]) {
    try {
      console.log(this.chatsNamespace.sockets.size);
      if (this.chatsNamespace.sockets.size > 0)
        this.chatsNamespace.emit(event, ...args);
    }
    catch (error) {
      AppLogger.error('Emit event error', { operation: 'socket:emit', error });
    }
  }
}

