import meow from "meow";
import ora from "ora";
import { execaCommand } from "execa";
import fs from "node:fs/promises";
const { flags } = meow(`
Simple Setup

Usage
  $ simple-setup

Options
  --no-git        Exclude simple-git-hooks
  --no-nano       Exclude nano-staged
  --no-prettier   Exclude Prettier
  --no-eslint     Exclude ESLint

Examples
  $ simple-setup
`, {
    importMeta: import.meta,
    booleanDefault: undefined,
    flags: {
        git: {
            type: "boolean",
            default: true,
        },
        nano: {
            type: "boolean",
            default: true,
        },
        prettier: {
            type: "boolean",
            default: true,
        },
        eslint: {
            type: "boolean",
            default: true,
        },
        help: {
            type: "boolean",
            alias: "h",
        },
    },
});
const nanoConfig = `module.exports = {
  '*.{js,jsx,ts,tsx,md,mdx,json,css,html}': 'prettier --write .',
}`;
const gitConfig = `module.exports = {
  "pre-commit": "./node_modules/.bin/nano-staged"
  "pre-push": "",
};`;
const prettierConfig = `module.exports = {}`;
// Actions
if (flags.nano) {
    let nanoSpinner = ora("Installing nano-staged…").start();
    await execaCommand("pnpm install -D nano-staged");
    nanoSpinner.succeed("nano-staged installed.");
    await fs.writeFile(".nano-staged.js", nanoConfig, "utf8");
}
if (flags.git) {
    let gitSpinner = ora("Installing simple-git-hooks…").start();
    await execaCommand("pnpm install -D simple-git-hooks");
    gitSpinner.succeed("simple-git-hooks installed.");
    await fs.writeFile(".simple-git-hooks.js", gitConfig, "utf8");
    let setupSpinner = ora("Setting up simple-git-hooks…").start();
    await execaCommand("pnpx simple-git-hooks");
    setupSpinner.succeed("simple-git-hooks setup complete.");
}
if (flags.prettier) {
    let prettierSpinner = ora("Installing prettier…").start();
    await execaCommand("pnpm install -D prettier");
    prettierSpinner.succeed("prettier installed.");
    await fs.writeFile(".prettier.config.js", prettierConfig, "utf8");
}
