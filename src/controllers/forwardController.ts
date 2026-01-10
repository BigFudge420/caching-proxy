import type { Request, Response, NextFunction } from "express";
import { argv } from "../argv.ts";
import sanitizeHeaders, {
  HOP_BY_HOP_HEADERS,
} from "../util/sanitizeHeaders.ts";
import { Buffer } from "node:buffer";
import crypto from "crypto";
import config from "../util/config.ts";
import checkCache from "../util/checkCache.ts";
import updateCache from "../util/updateCache.ts";

const forwardController = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const upstreamURL = argv.origin + req.originalUrl;

  // create pkey
  const secret = config.secret;
  const pkey = crypto
    .createHmac("sha256", secret)
    .update(`${upstreamURL}${req.method.toUpperCase()}`)
    .digest("hex");

  // check cache (skip in test mode)
  let cache: false | { status: number; headers: any; body: string | null } =
    false;
  if (!process.env.NODE_ENV?.includes("test")) {
    try {
      cache = await checkCache(req, pkey);
    } catch (error) {
      // Redis not available, skip caching
      cache = false;
    }
  }

  if (cache) {
    res.status(cache.status);

    for (const [k, v] of Object.entries(cache.headers)) {
      if (HOP_BY_HOP_HEADERS.includes(k.toLowerCase())) {
        continue;
      }

      res.setHeader(k, String(v));
    }

    if (cache.body) res.setHeader("Content-Length", cache.body?.length);
    return res.send(cache.body);
  }

  const body =
    req.method === "GET" || req.method === "HEAD" ? undefined : req.body;

  const headers = sanitizeHeaders(req);

  const upstreamRes = await fetch(upstreamURL, {
    method: req.method,
    headers,
    body,
  });

  const resBody = Buffer.from(await upstreamRes.arrayBuffer());

  for (const [k, v] of upstreamRes.headers.entries()) {
    if (HOP_BY_HOP_HEADERS.includes(k.toLowerCase())) {
      continue;
    }

    res.setHeader(k, v);
  }

  res.setHeader("Content-Length", resBody.length);
  res.status(upstreamRes.status);
  res.send(resBody);

  // Update cache, fail silently if Redis not available (skip in test mode)
  if (!process.env.NODE_ENV?.includes("test")) {
    try {
      updateCache(req, upstreamRes, resBody, pkey);
    } catch (error) {
      // Cache update failed, continue normally
    }
  }
};

export default forwardController;
