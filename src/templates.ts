export const nanoConfig = `{
  '*.{js,jsx,ts,tsx,md,mdx,json,css,html}': 'prettier --write .',
}`;

export const gitConfig = `{
  "pre-commit": "./node_modules/.bin/nano-staged",
  "pre-push": ""
}`;

export const prettierConfig = `{}`;
