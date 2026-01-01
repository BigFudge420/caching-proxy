import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  testEnvironment: "node",

  // Treat TS as ESM
  extensionsToTreatAsEsm: [".ts"],

  // Transform TS → JS for Jest
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.json",
      },
    ],
  },

  // Required for ESM path resolution
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  // Global test setup (your nock setup)
  setupFilesAfterEnv: ["<rootDir>/src/test.setup.ts"],

  // Test file patterns
  testMatch: ["**/?(*.)+(spec|test).ts"],

  // Cleaner output
  clearMocks: true,
  restoreMocks: true,

  // Optional but nice
  verbose: true,
};

export default config;
