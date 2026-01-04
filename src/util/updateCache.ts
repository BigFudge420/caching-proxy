import type { Request } from "express";
import crypto from "crypto";
import config from "./config";
import redis from "../clients/redis";
import { HOP_BY_HOP_HEADERS } from "./sanitizeHeaders";

const updateCache = async (
  req: Request,
  res: globalThis.Response,
  bodyBuf: Buffer,
  pkey: string
) => {
  // check for vary headers
  if (res.headers.get("vary")?.trim()) {
    const varyHeader: string = res.headers.get("vary") ?? "";
    if (varyHeader === "*") return;
    if (!varyHeader) return;

    const varyKeys = varyHeader
      .toLowerCase()
      .split(",")
      .map((v) => v.trim());

    const vary: Record<string, string | null> = {};
    for (const key of varyKeys) {
      const value = req.headers[key];
      vary[key] = Array.isArray(value) ? value.join(",") : value ?? null;
    }

    // create secondary key with vary headers
    const secret = config.secret;
    const varyBuf = Buffer.from(JSON.stringify(vary));
    const skey: string = crypto
      .createHmac("sha256", secret)
      .update(varyBuf)
      .digest("hex");

    // create metadata
    const metadata = {
      method: req.method.toUpperCase(),
      createdAt: Date.now(),
      vary,
    };

    // store metadata in cache
    await redis.hSet(pkey, "metadata", JSON.stringify(metadata));

    // cache response status
    await redis.hSet(`${pkey}:vary:${skey}`, "status", String(res.status));

    // filter response headers
    const resHeaders: Record<string, string> = {};
    for (const [k, v] of res.headers.entries()) {
      if (HOP_BY_HOP_HEADERS.includes(k.toLowerCase())) {
        continue;
      }

      resHeaders[k] = v;
    }

    // cache response headers
    await redis.hSet(
      `${pkey}:vary:${skey}`,
      "headers",
      JSON.stringify(resHeaders)
    );

    // cache response body as buffer
    await redis.hSet(`${pkey}:vary:${skey}`, "body", bodyBuf);
  } else {
    // create metadata with no vary headers
    const metadata = {
      method: req.method.toUpperCase(),
      createdAt: Date.now(),
      vary: undefined,
    };

    // cache metadata (undefined vary header)
    await redis.hSet(pkey, "metadata", JSON.stringify(metadata));

    // Deterministic key produced by applying HMAC-SHA256 on an empty string with using the predefined secret
    const skey: string = config.skey_default;

    // cache response status
    await redis.hSet(`${pkey}:vary:${skey}`, "status", String(res.status));

    // filter response headers
    const resHeaders: Record<string, string> = {};
    for (const [k, v] of res.headers.entries()) {
      if (HOP_BY_HOP_HEADERS.includes(k.toLowerCase())) {
        continue;
      }

      resHeaders[k] = v;
    }

    // cache response headers
    await redis.hSet(
      `${pkey}:vary:${skey}`,
      "headers",
      JSON.stringify(resHeaders)
    );

    // cache response body as buffer
    await redis.hSet(`${pkey}:vary:${skey}`, "body", bodyBuf);
  }
};

export default updateCache;
