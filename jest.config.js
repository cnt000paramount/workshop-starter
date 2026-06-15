/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    // diagnostics:false -> ts-jest traspila senza bloccare sull'errore
    // intenzionale di errorHandler.ts (che resta visibile in VS Code per /fix)
    '^.+\\.tsx?$': ['ts-jest', { diagnostics: false }],
  },
};
