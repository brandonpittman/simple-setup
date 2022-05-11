import ora from "ora";
import { execaCommand } from "execa";
import fs from "node:fs/promises";

import { nanoConfig, gitConfig, prettierConfig } from "./templates.js";

import type { CliFlags } from "./index.js";

export const runCommands = async (flags: CliFlags) => {
  if (flags.nano) await nanoStaged();
  if (flags.git) await simpleGitHooks();
  if (flags.prettier) await prettier();
};

export const nanoStaged = async () => {
  let nanoSpinner = ora("Installing nano-staged…").start();
  await execaCommand("pnpm install -D nano-staged");
  nanoSpinner.succeed("nano-staged installed.");
  await fs.writeFile(".nano-staged.js", nanoConfig, "utf8");
};

export const simpleGitHooks = async () => {
  let gitSpinner = ora("Installing simple-git-hooks…").start();
  await execaCommand("pnpm install -D simple-git-hooks");
  gitSpinner.succeed("simple-git-hooks installed.");
  await fs.writeFile(".simple-git-hooks.js", gitConfig, "utf8");

  let setupSpinner = ora("Setting up simple-git-hooks…").start();
  await execaCommand("pnpx simple-git-hooks");
  setupSpinner.succeed("simple-git-hooks setup complete.");
};

export const prettier = async () => {
  let prettierSpinner = ora("Installing prettier…").start();
  await execaCommand("pnpm install -D prettier");
  prettierSpinner.succeed("prettier installed.");
  await fs.writeFile(".prettier.config.js", prettierConfig, "utf8");
};
