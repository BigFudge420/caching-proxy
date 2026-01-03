import type { Request } from "express";

const mockReq = (overrides: Partial<Request> = {}): Request =>
  ({
    method: "GET",
    originalUrl: "/",
    headers: {},
    body: undefined,
    params: {},
    query: {},
    ...overrides,
  } as Request);

export default mockReq;
