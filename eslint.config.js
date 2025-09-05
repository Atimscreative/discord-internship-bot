const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
    },
    rules: {
      "no-var": "error",
      "no-undef": "warn",
    },
  },
];
