export default {
    testEnvironment: "node",
    transform: {},
    testMatch: ["**/tests/**/*.test.js"],
    setupFiles: [
        "dotenv/config",
        "<rootDir>/tests/setupEnv.js"
    ],
        setupFilesAfterEnv: [
        "<rootDir>/tests/setupDatabase.js"
    ],
    verbose: true
};
