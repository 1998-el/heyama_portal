import { io, type Socket } from "socket.io-client";
import type { ObjectItem } from "./api";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      transports: ["websocket", "polling"],
    });
  }
  return socket;
}

export type ObjectEventHandler = (obj: ObjectItem) => void;
export type DeleteEventHandler = (id: string) => void;

export function onObjectCreated(handler: ObjectEventHandler) {
  getSocket().on("object-created", handler);
  return () => getSocket().off("object-created", handler);
}

export function onObjectDeleted(handler: DeleteEventHandler) {
  getSocket().on("object-deleted", handler);
  return () => getSocket().off("object-deleted", handler);
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
