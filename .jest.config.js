module.exports = {
    collectCoverage: true,
    coverageDirectory: "coverage",
    collectCoverageFrom: ["src/**/*.js", "!src/**/*.test.js"],
    coverageReporters: ["text", "html"],
  };
  