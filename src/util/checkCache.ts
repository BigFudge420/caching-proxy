import type { Request } from "express";
import redis from "../clients/redis.ts";
import config from "./config.ts";
import crypto from "crypto";

const checkCache = async (req: Request, pkey: string) => {
  // check for vary headers
  const metadata = await redis.hGet(pkey, "metadata");

  if (!metadata) return false;

  const varyArr: string[] = JSON.parse(metadata).vary;

  // fetch cache if metadata doesnt exist
  if (!varyArr) {
    const skey = config.skey_default;

    const status = await redis.hGet(`${pkey}:vary:${skey}`, "status");
    const resHeaders = await redis.hGet(`${pkey}:vary:${skey}`, "headers");
    const resBody = await redis.hGet(`${pkey}:vary:${skey}`, "body");

    if (status === null || resHeaders === null) return false;

    return {
      status: parseInt(status),
      headers: JSON.parse(resHeaders),
      body: resBody ? Buffer.from(resBody, "base64") : null,
    };
  }

  // extract vary headers from request
  const varyHeaders: Record<string, string | null> = {};
  for (const v of varyArr) {
    const value = req.headers[v];
    varyHeaders[v] = Array.isArray(value)
      ? value.join(",").toLowerCase()
      : (value?.toLowerCase() ?? null);
  }

  // create secondary key
  const secret = config.secret;

  const skey = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(varyHeaders))
    .digest("hex");

  // fetch varied cache or return false if not cached
  const cached = await redis.exists(`${pkey}:vary:${skey}`);
  if (!cached) return false;

  const status = await redis.hGet(`${pkey}:vary:${skey}`, "status");
  const resHeaders = await redis.hGet(`${pkey}:vary:${skey}`, "headers");
  const resBody = await redis.hGet(`${pkey}:vary:${skey}`, "body");

  if (status === null || resHeaders === null) return false;

  return {
    status: parseInt(status),
    headers: JSON.parse(resHeaders),
    body: resBody ? Buffer.from(resBody, "base64") : null,
  };
};

export default checkCache;
