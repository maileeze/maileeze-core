module.exports = {
  extends: ["eslint-config-airbnb-base", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "no-console": "off",
    "import/prefer-default-export": "off",
    "import/extensions": "off"
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".ts"],
        moduleDirectory: ["node_modules", "./src"]
      }
    }
  },
  parserOptions: {
    project: "./tsconfig.json",
    extraFileExtensions: [".d.ts"]
  }
};
