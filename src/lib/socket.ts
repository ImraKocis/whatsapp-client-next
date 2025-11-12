import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (userId: number): Socket => {
  if (!socket) {
    socket = io(`${process.env.NEXT_PUBLIC_BASE_WS_URL}/chat`, {
      auth: {
        userId: userId,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
