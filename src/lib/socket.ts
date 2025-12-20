import { io, Socket as SocketIOClient } from "socket.io-client";

let socket: SocketIOClient | null = null;

export const getSocket = (): SocketIOClient | null => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!socket) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    socket = io(apiUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
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
