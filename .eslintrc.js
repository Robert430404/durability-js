module.exports = {
  env: {
    es2021: true,
    browser: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "airbnb-base",
    "prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "import/prefer-default-export": "off",
    "import/no-unresolved": "off",
    "import/extensions": "off",

    // These have TS alternatives that are in the repo
    "no-shadow": "off",
    "no-unused-vars": "off",
    "no-undef": "off",
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
  },
};
