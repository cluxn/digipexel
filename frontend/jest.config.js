const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

module.exports = createJestConfig({
  workerIdleMemoryLimit: "256MB",
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
});
