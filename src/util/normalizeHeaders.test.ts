import { describe, it } from "node:test";
import assert from "node:assert";
import normalizeHeaders from "./normalizeHeaders.ts";
import mockReq from "./mockReq.ts";

describe("normalzieHeaders", () => {
  const req1 = mockReq({
    method: "GET",
    headers: {
      "accept-encoding": "br, gzip,identity",
      "accept-language": "en-US, en;q=0.8, en;q=0.7",
      authorization: "",
    },
  });

  const normalized1 = normalizeHeaders(req1);

  it("test accept-encoding", () => {
    assert.strictEqual(normalized1.get("accept-encoding"), "br");
  });

  it("test accept-language", () => {
    assert.strictEqual(normalized1.get("accept-language"), "en-us");
  });

  it("test auth", () => {
    assert.strictEqual(normalized1.get("authorization"), "");
  });

  const req2 = mockReq({
    method: "GET",
    headers: {
      "accept-encoding": "identity, gzip",
      "accept-language": "fr-CH, en;q=0.8, en;q=0.7",
      authorization: "Bearer abc123",
    },
  });

  const normalized2 = normalizeHeaders(req2);

  it("test accept-encoding", () => {
    assert.strictEqual(normalized2.get("accept-encoding"), "gzip");
  });

  it("test accept-language", () => {
    assert.strictEqual(normalized2.get("accept-language"), "fr-ch");
  });

  it("test auth", () => {
    assert.strictEqual(normalized2.get("authorization"), "Bearer abc123");
  });
});
