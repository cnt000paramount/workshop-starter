/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  transform: {
    // diagnostics:false -> ts-jest transpiles without blocking on the intentional
    // error in errorHandler.ts (which remains visible in VS Code for /fix)
    "^.+\\.tsx?$": ["ts-jest", { diagnostics: false }],
  },
};
