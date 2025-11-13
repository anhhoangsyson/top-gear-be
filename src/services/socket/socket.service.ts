import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import connectRedis from '../../config/redis/redis.config';
import { Users } from '../../api/users/schema/user.schema';
import { getAccessToken } from '../../middlewares/token/createToken';

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
      socket.on('authenticate', async (token: string) => {
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
        } catch (error: any) {
          // Handle token expiration - try to refresh token
          if (error.name === 'TokenExpiredError') {
            try {
              const decoded = (jwt.decode(token) as any) || null;

              if (!decoded || !decoded._id) {
                console.error('❌ Token expired and cannot decode');
                socket.emit('authentication_error', {
                  message: 'Token hết hạn và không thể giải mã',
                  code: 'TOKEN_EXPIRED',
                  expiredAt: error.expiredAt,
                });
                return;
              }

              // Check Redis for refresh token
              const redisClient = connectRedis();
              const storedRefreshToken = await redisClient.get(decoded._id);

              if (!storedRefreshToken) {
                console.error('❌ Token expired and no refresh token found');
                socket.emit('authentication_error', {
                  message: 'Token hết hạn, vui lòng đăng nhập lại',
                  code: 'TOKEN_EXPIRED_NO_REFRESH',
                  expiredAt: error.expiredAt,
                });
                return;
              }

              // Verify refresh token
              try {
                const refreshDecoded = jwt.verify(
                  storedRefreshToken,
                  process.env.JWT_REFESH_SECREt || '',
                ) as any;

                // Get user from database
                const user = await Users.findOne({ _id: decoded._id });
                if (!user) {
                  socket.emit('authentication_error', {
                    message: 'Người dùng không tồn tại',
                    code: 'USER_NOT_FOUND',
                  });
                  return;
                }

                // Generate new access token
                const newToken = getAccessToken(user._id, user.role);
                const userId = user._id.toString();

                // Add socket to user's socket list
                const existingSockets = this.userSockets.get(userId) || [];
                this.userSockets.set(userId, [...existingSockets, socket.id]);

                socket.data.userId = userId;
                socket.join(`user:${userId}`);

                console.log(
                  `✅ User ${userId} authenticated with refreshed token on socket ${socket.id}`,
                );

                // Emit authenticated with new token
                socket.emit('authenticated', {
                  userId,
                  newToken, // Send new token to frontend
                });
              } catch (refreshError) {
                console.error('❌ Refresh token invalid:', refreshError);
                socket.emit('authentication_error', {
                  message: 'Refresh token không hợp lệ, vui lòng đăng nhập lại',
                  code: 'REFRESH_TOKEN_INVALID',
                });
              }
            } catch (decodeError) {
              console.error('❌ Token decode error:', decodeError);
              socket.emit('authentication_error', {
                message: 'Token không hợp lệ',
                code: 'TOKEN_INVALID',
              });
            }
          } else {
            // Other JWT errors
            console.error('❌ Authentication error:', error.message);
            socket.emit('authentication_error', {
              message: 'Token không hợp lệ',
              code: 'TOKEN_INVALID',
              error: error.message,
            });
          }
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
