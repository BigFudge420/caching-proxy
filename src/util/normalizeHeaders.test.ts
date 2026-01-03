import { describe, it } from "node:test";
import assert from "node:assert";
import normalizeHeaders from "./normalizeHeaders.ts";

describe("normalzieHeaders", () => {
  const headers1 = new Headers();
  headers1.set("Accept-Encoding", "br, gzip, identity");
  headers1.set("Accept-language", "en-US, en;q=0.8, en;q=0.7");
  headers1.set("Authorization", "");

  const normalized1 = normalizeHeaders(headers1);

  it("test accept-encoding", () => {
    assert.strictEqual(normalized1.get("accept-encoding"), "br");
  });

  it("test accept-language", () => {
    assert.strictEqual(normalized1.get("accept-language"), "en-us");
  });

  it("test auth", () => {
    assert.strictEqual(normalized1.get("authorization"), "");
  });

  const headers2 = new Headers();
  headers2.set("Accept-Encoding", "identity, gzip");
  headers2.set(
    "Accept-language",
    "fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5"
  );
  headers2.set("Authorization", "Bearer abc123");

  const normalized2 = normalizeHeaders(headers2);

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
