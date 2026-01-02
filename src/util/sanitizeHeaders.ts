import type { Request } from "express";

export const HOP_BY_HOP_HEADERS = [
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
];

const sanitizeHeaders = (req: Request): Headers => {
  const sanitized = new Headers();
  const connectionHeaders = req.headers.connection;

  for (const [key, value] of Object.entries(req.headers)) {
    if (
      HOP_BY_HOP_HEADERS.includes(key.toLowerCase()) ||
      connectionHeaders?.includes(key.toLowerCase())
    ) {
      continue;
    }

    if (Array.isArray(value)) {
      sanitized.set(key, value.join(", "));
    } else if (value !== undefined) {
      sanitized.set(key, String(value));
    }
  }

  const clientIP = req.ip ?? req.socket.remoteAddress ?? "unknown";
  const proto = req.protocol;
  const host = req.headers.host ?? "unknown";

  const newForwarded = `for=${clientIP};host=${host};proto=${proto}`;
  const existingForwared = req.headers["forwarded"];

  const forwarded = existingForwared
    ? `${existingForwared}, ${newForwarded}`
    : newForwarded;

  sanitized.set("forwarded", forwarded);

  return sanitized;
};

export default sanitizeHeaders;
