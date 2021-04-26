module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: [
    "<rootDir>/.aws-sam",
    "<rootDir>/dist",
    "<rootDir>/__tests__/fixtures",
    "<rootDir>/__tests__/utils",
    "<rootDir>/__tests__/global-setup.js",
    "<rootDir>/config"
  ],
  clearMocks: true,
};
