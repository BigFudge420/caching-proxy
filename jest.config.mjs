export default {
  testEnvironment: 'node',
  
  transform: {
    '^.+\\.(ts|js)$': 'babel-jest'
  },
  
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^yargs$': '<rootDir>/__mocks__/yargs.js',
    '^yargs/helpers$': '<rootDir>/__mocks__/yargs-helpers.js'
  },
  
  transformIgnorePatterns: [
    'node_modules/(?!(@jest/.*|yargs|yargs-parser)/)'
  ],
  
  setupFilesAfterEnv: ['<rootDir>/src/test.setup.js'],
  
  testMatch: ['**/__tests__/**/*.(ts|js)', '**/?(*.)+(spec|test).(ts|js)'],
  
  extensionsToTreatAsEsm: ['.ts']
};