import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';

interface UserSocket {
  userId: string;
  socketId: string;
}

class SocketService {
  private io: SocketIOServer | null = null;
  private userSockets: Map<string, string[]> = new Map(); // userId -> socketIds[]

  initialize(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: ['http://localhost:3001', 'http://localhost:3000'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupConnectionHandlers();
    console.log('✅ Socket.IO initialized successfully');
  }

  private setupConnectionHandlers() {
    if (!this.io) return;

    this.io.on('connection', (socket) => {
      console.log(`🔌 New socket connection: ${socket.id}`);

      // Authentication
      socket.on('authenticate', (token: string) => {
        try {
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your-secret-key',
          ) as any;
          const userId = decoded.userId || decoded._id || decoded.id;

          if (userId) {
            // Add socket to user's socket list
            const existingSockets = this.userSockets.get(userId) || [];
            this.userSockets.set(userId, [...existingSockets, socket.id]);

            socket.data.userId = userId;
            socket.join(`user:${userId}`);

            console.log(
              `✅ User ${userId} authenticated on socket ${socket.id}`,
            );
            socket.emit('authenticated', { userId });
          }
        } catch (error) {
          console.error('❌ Authentication error:', error);
          socket.emit('authentication_error', { message: 'Invalid token' });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        const userId = socket.data.userId;
        if (userId) {
          const sockets = this.userSockets.get(userId) || [];
          const updatedSockets = sockets.filter((id) => id !== socket.id);

          if (updatedSockets.length === 0) {
            this.userSockets.delete(userId);
          } else {
            this.userSockets.set(userId, updatedSockets);
          }

          console.log(
            `👋 User ${userId} disconnected from socket ${socket.id}`,
          );
        }
      });

      // Ping-pong for connection health
      socket.on('ping', () => {
        socket.emit('pong');
      });
    });
  }

  // Emit notification to specific user
  emitToUser(userId: string, event: string, data: any) {
    if (!this.io) {
      console.error('❌ Socket.IO not initialized');
      return;
    }

    this.io.to(`user:${userId}`).emit(event, data);
    console.log(`📤 Emitted '${event}' to user ${userId}`);
  }

  // Emit notification to multiple users
  emitToUsers(userIds: string[], event: string, data: any) {
    userIds.forEach((userId) => {
      this.emitToUser(userId, event, data);
    });
  }

  // Broadcast to all connected clients
  broadcast(event: string, data: any) {
    if (!this.io) {
      console.error('❌ Socket.IO not initialized');
      return;
    }

    this.io.emit(event, data);
    console.log(`📢 Broadcasted '${event}' to all users`);
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }

  // Get all online users
  getOnlineUsers(): string[] {
    return Array.from(this.userSockets.keys());
  }

  // Get socket instance
  getIO(): SocketIOServer | null {
    return this.io;
  }
}

export default new SocketService();
