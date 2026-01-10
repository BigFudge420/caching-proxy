import config from "./config.ts";
import crypto from "crypto";
import type { Request } from "express";
import normalizeHeaders from "./normalizeHeaders.ts";
import { normalizeURL } from "./normalizeURL.ts";

const createKey = (req: Request): string => {
  const normalizedUrl = normalizeURL(req.originalUrl);
  const normalizedHeaders = normalizeHeaders(req);
  const secret = config.secret;

  const bodyHash =
    req.body && Buffer.byteLength(req.body) > 0
      ? crypto.createHmac("sha256", secret).update(req.body).digest("hex")
      : "";

  const reqObj = {
    url: normalizedUrl,
    method: req.method.toUpperCase(),
    headers: normalizedHeaders,
    bodyHash,
  };

  const reqBuffer = Buffer.from(JSON.stringify(reqObj));

  const key = crypto
    .createHmac("sha256", secret)
    .update(reqBuffer)
    .digest("hex");

  return key;
};

export default createKey;
