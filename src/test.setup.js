import { beforeAll, afterAll, afterEach } from '@jest/globals';
import nock from "nock";

beforeAll(() => {
  nock.disableNetConnect();
  nock.enableNetConnect("127.0.0.1");
});

afterEach(() => {
  if (!nock.isDone()) {
    console.error("❌ Pending nock mocks:", nock.pendingMocks());
  }
  nock.cleanAll();
});

afterAll(() => {
  nock.enableNetConnect();
});