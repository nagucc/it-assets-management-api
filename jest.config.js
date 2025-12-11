module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  rootDir: './src',
  collectCoverage: true,
  coverageDirectory: '../coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
};