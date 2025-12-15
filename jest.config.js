module.exports = {
  transform: {
    '^.+\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.(test|spec).[jt]s?(x)'],
  testPathIgnorePatterns: ['/test/utils/'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  rootDir: '.',
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  maxWorkers: 1,
  forceExit: true,
  clearMocks: true,
  resetModules: true,
};