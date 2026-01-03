import { describe, it } from "node:test";
import { normalizeURL } from "./normalizeURL.ts";
import assert from "node:assert";

describe("normalizeURL", () => {
  it("normalizes protocol casing, path, and query params", () => {
    const raw =
      "HTTP://EXAMPLE.com:443//api/./v1/../v1/users/?b=2&a=1&space=hello+world";
    const expected =
      "http://example.com:443/api/v1/users?a=1&b=2&space=hello%20world";

    assert.strictEqual(normalizeURL(raw), expected);
  });

  it("sorts repeated query parameters", () => {
    const raw = "https://example.com/items?id=3&id=1&id=2";
    const expected = "https://example.com/items?id=1&id=2&id=3";

    assert.strictEqual(normalizeURL(raw), expected);
  });

  it("removes trailing slash from pathname", () => {
    const raw = "https://example.com/api/users/";
    const expected = "https://example.com/api/users";

    assert.strictEqual(normalizeURL(raw), expected);
  });

  it("resolves dot segments and duplicate slashes", () => {
    const raw = "https://example.com//api/../api/v1//users";
    const expected = "https://example.com/api/v1/users";

    assert.strictEqual(normalizeURL(raw), expected);
  });

  it("lowercases host and removes default http port", () => {
    const raw = "HTTP://EXAMPLE.com:80/api/users";
    const expected = "http://example.com/api/users";

    assert.strictEqual(normalizeURL(raw), expected);
  });
});
