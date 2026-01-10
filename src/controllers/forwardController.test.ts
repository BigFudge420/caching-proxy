import request from "supertest";
import { describe, it } from "node:test";
import assert from "node:assert";
import app from "../app.ts";
import nock from "nock";

describe("cacheController", () => {
  it("tests request forwarding", async () => {
    nock("https://dummyjson.com")
      .get("/product")
      .reply(200, { products: [1, 2, 3, 4] });

    const res = await request(app).get("/product");

    assert.strictEqual(res.get("content-type"), "application/json");
    assert.strictEqual(res.status, 200);
    assert.deepStrictEqual(res.body.products, [1, 2, 3, 4]);
  });

  it("tests params forwarding", async () => {
    nock("https://dummyjson.com")
      .get("/product")
      .query({ ids: [1, 2] })
      .reply(200, { query: { limit: 10 } });

    const res1 = await request(app).get("/product?ids=1&ids=2");

    assert.strictEqual(res1.status, 200);
    assert.deepStrictEqual(res1.body.query, { limit: 10 });

    nock("https://dummyjson.com")
      .get("/product")
      .query({ A: "a", B: "b" })
      .reply(200, { dummy: "json" });

    const res2 = await request(app).get("/product?A=a&B=b");

    assert.strictEqual(res2.status, 200);
    assert.deepStrictEqual(res2.body, { dummy: "json" });
    assert.strictEqual(nock.isDone(), true);
  });

  it("tests http methods", async () => {
    nock("https://dummyjson.com").get("/product").reply(200, { method: "get" });

    const resGet = await request(app).get("/product");

    assert.strictEqual(resGet.status, 200);
    assert.strictEqual(resGet.body.method, "get");

    nock("https://dummyjson.com")
      .post("/product")
      .reply(200, { method: "post" });

    const resPost = await request(app).post("/product");

    assert.strictEqual(resPost.status, 200);
    assert.strictEqual(resPost.body.method, "post");

    nock("https://dummyjson.com")
      .delete("/product/id")
      .reply(200, { method: "delete" });

    const resDel = await request(app).delete("/product/id");

    assert.strictEqual(resDel.status, 200);
    assert.strictEqual(resDel.body.method, "delete");
  });

  it("tests response body forwarding", async () => {
    const obj = { message: "forwarded", hello: "world" };

    nock("https://dummyjson.com").get("/product").reply(200, obj);

    const bufferA = Buffer.from(JSON.stringify(obj));

    const res = await request(app)
      .get("/product")
      .buffer(true)
      .parse((res, cb) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => cb(null, Buffer.concat(chunks)));
      });

    const bufferB = Buffer.from(res.body);
    const bool = bufferA.equals(bufferB);

    assert.strictEqual(bool, true);
  });

  it("tests request body forwarding", async () => {
    nock("https://dummyjson.com")
      .post("/product", { hello: "world" })
      .reply(200, function (_url, body) {
        return body;
      });

    const res = await request(app)
      .post("/product")
      .buffer(true)
      .send({ hello: "world" })
      .parse((res, cb) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => cb(null, Buffer.concat(chunks)));
      });

    const buf = Buffer.from(JSON.stringify({ hello: "world" }));

    const bool = buf.equals(res.body);

    assert.strictEqual(bool, true);
  });

  it("tests request header forwarding", async () => {
    nock("https://dummyjson.com")
      .get("/product")
      .matchHeader("Authorization", "Bearer token")
      .matchHeader("X-test", (val) => {
        return val.includes("works");
      })
      .reply(200, { status: "ok" });

    const headers = {
      Authorization: "Bearer token",
      "X-test": "test, works, application/json",
    };

    const res1 = await request(app).get("/product").set(headers);

    assert.strictEqual(res1.status, 200);

    nock("https://dummyjson.com").get("/product").reply(
      200,
      { hello: "world" },
      {
        "x-test": "works",
      }
    );

    const res2 = await request(app).get("/product");
    const xTestHeader = res2.get("x-test");

    assert.strictEqual(xTestHeader, "works");
    assert.strictEqual(nock.isDone(), true);
  });

  it("tests status code forwarding", async () => {
    nock("https://dummyjson.com").get("/product").reply(200);

    const res200 = await request(app).get("/product");

    assert.strictEqual(res200.status, 200);

    nock("https://dummyjson.com").get("/product").reply(300);

    const res300 = await request(app).get("/product");

    assert.strictEqual(res300.status, 300);

    nock("https://dummyjson.com").get("/product").reply(400);

    const res400 = await request(app).get("/product");

    assert.strictEqual(res400.status, 400);
    assert.strictEqual(nock.isDone(), true);
  });
});
