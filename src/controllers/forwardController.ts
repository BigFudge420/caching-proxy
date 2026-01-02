import type { Request, Response, NextFunction } from "express";
import { argv } from "../argv.ts";
import sanitizeHeaders, {
  HOP_BY_HOP_HEADERS,
} from "../util/sanitizeHeaders.ts";
import { Buffer } from "node:buffer";

const forwardController = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const upstreamURL = argv.origin + req.originalUrl;
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
};

export default forwardController;
