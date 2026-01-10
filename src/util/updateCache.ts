import type { Request } from "express";
import crypto from "crypto";
import config from "./config.ts";
import redis from "../clients/redis.ts";
import { HOP_BY_HOP_HEADERS } from "./sanitizeHeaders.ts";

const updateCache = async (
  req: Request,
  res: globalThis.Response,
  bodyBuf: Buffer,
  pkey: string
) => {
  const ttl = config.ttl;

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
      vary: varyKeys,
    };

    const varyKey = `${pkey}:vary:${skey}`;

    // queue caching to ensure atomicity
    const multi = redis.multi();

    // cache with primary key (metadata)
    multi.hSet(pkey, "metadata", JSON.stringify(metadata));
    multi.expire(pkey, ttl);

    // filter response headers
    const resHeaders: Record<string, string> = {};
    for (const [k, v] of res.headers.entries()) {
      if (HOP_BY_HOP_HEADERS.includes(k.toLowerCase())) continue;
      resHeaders[k] = v;
    }

    // cache with vary key (response)
    multi.hSet(varyKey, {
      status: String(res.status),
      headers: JSON.stringify(resHeaders),
      body: bodyBuf,
    });
    multi.expire(varyKey, ttl);

    await multi.exec();
  } else {
    // create metadata with no vary headers
    const metadata = {
      method: req.method.toUpperCase(),
      createdAt: Date.now(),
      vary: undefined,
    };

    // assign deterministic default skey
    const skey: string = config.skey_default;
    const varyKey = `${pkey}:vary:${skey}`;

    const multi = redis.multi();

    // cache with primary key (metadata)
    multi.hSet(pkey, "metadata", JSON.stringify(metadata));
    multi.expire(pkey, ttl);

    // filter response headers
    const resHeaders: Record<string, string> = {};
    for (const [k, v] of res.headers.entries()) {
      if (HOP_BY_HOP_HEADERS.includes(k.toLowerCase())) continue;
      resHeaders[k] = v;
    }

    // cache with vary key (response)
    multi.hSet(varyKey, {
      status: String(res.status),
      headers: JSON.stringify(resHeaders),
      body: bodyBuf,
    });
    multi.expire(varyKey, ttl);

    await multi.exec();
  }
};

export default updateCache;
