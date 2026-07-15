import { io, type Socket } from "socket.io-client";
import type { ObjectItem } from "./api";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  (typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")
    ? "http://localhost:3001"
    : "");

let socket: Socket | null = null;

function createSocket(): Socket | null {
  if (!SOCKET_URL) return null;
  return io(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket", "polling"],
  });
}

export function getSocket(): Socket | null {
  if (!socket) {
    socket = createSocket();
  }
  return socket;
}

export type ObjectEventHandler = (obj: ObjectItem) => void;
export type DeleteEventHandler = (id: string) => void;

export function onObjectCreated(handler: ObjectEventHandler) {
  const s = getSocket();
  if (!s) return () => {};
  s.on("object-created", handler);
  try {
    s.connect();
  } catch {
    // ignore connection errors in production when no socket server is available
  }
  return () => s.off("object-created", handler);
}

export function onObjectDeleted(handler: DeleteEventHandler) {
  const s = getSocket();
  if (!s) return () => {};
  s.on("object-deleted", handler);
  try {
    s.connect();
  } catch {
    // ignore connection errors in production when no socket server is available
  }
  return () => s.off("object-deleted", handler);
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
