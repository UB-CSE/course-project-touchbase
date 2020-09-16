module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
    "import/extensions": [
      "error",
      "always",
      {
        js: "never",
        mjs: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
  },
  overrides: [
    {
      files: ["**/__tests__/*.{j,t}s?(x)", "**/*.test.{j,t}s?(x)", "**/*.spec.{j,t}s?(x)"],
      env: {
        jest: true,
      },
      rules: {
        "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
      },
    },
  ],
};