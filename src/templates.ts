export const nanoConfig = `module.exports = {
  '*.{js,jsx,ts,tsx,md,mdx,json,css,html}': 'prettier --write .',
}`;

export const gitConfig = `module.exports = {
  "pre-commit": "./node_modules/.bin/nano-staged",
  "pre-push": "",
};`;

export const prettierConfig = `module.exports = {}`;
