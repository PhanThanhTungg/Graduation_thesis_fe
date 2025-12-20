"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { Socket as SocketIOClient } from "socket.io-client";

interface SocketContextType {
  socket: SocketIOClient | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export function SocketProvider({ children }: { children: ReactNode }) {
  const socket = getSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connected", (data) => {
      console.log("Server connection confirmed:", data);
    });

    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("connected");
      }
    };
  }, [socket]);

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context.socket;
}
