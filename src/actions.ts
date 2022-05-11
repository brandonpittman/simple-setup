import ora, { oraPromise } from "ora";
import { execaCommand } from "execa";
import { access, readFile, writeFile } from "node:fs/promises";

import { nanoConfig, gitConfig, prettierConfig } from "./templates.js";

import type { CliFlags } from "./index.js";

export const runCommands = async (flags: CliFlags) => {
  console.clear();
  if (flags.nano) await nanoStaged();
  if (flags.git) await simpleGitHooks();
  if (flags.prettier) await prettier();
};

export const nanoStaged = async () => {
  let nanoSpinner = ora("Installing nano-staged…").start();
  await execaCommand("pnpm install -D nano-staged");
  nanoSpinner.succeed("nano-staged installed.");

  let nanoConfigSpinner = ora("Adding .nano-staged.json…").start();
  try {
    await access(".nano-staged.json");
    nanoConfigSpinner.warn(".nano-staged.json already exists!");
  } catch {
    await writeFile(".nano-staged.json", nanoConfig, "utf8");
    nanoConfigSpinner.succeed(".nano-staged.json created.");
  }
};

export const simpleGitHooks = async () => {
  let gitSpinner = ora("Installing simple-git-hooks…").start();
  await execaCommand("pnpm install -D simple-git-hooks");
  gitSpinner.succeed("simple-git-hooks installed.");

  let setupSpinner = ora("Setting up simple-git-hooks…").start();

  const writePackageJson = async () => {
    let spinner = ora(
      "Adding postinstall script for simple-git-hooks…"
    ).start();

    try {
      await access("package.json");
      let packageJSON = JSON.parse(await readFile("package.json", "utf8"));
      packageJSON.scripts = {
        ...packageJSON.scripts,
        ...{ postinstall: "npx simple-git-hooks" },
      };
      await writeFile(
        "package.json",
        JSON.stringify(packageJSON, null, 2),
        "utf8"
      );
      spinner.succeed("postinstall script created.");
    } catch (e) {
      await execaCommand("npm init -y");
      await writePackageJson();
    }
  };

  const writeConfig = async () => {
    let spinner = ora("Creating .simple-git-hooks.json…").start();

    try {
      await writeFile(".simple-git-hooks.json", gitConfig, "utf8");
      spinner.warn(".simple-git-hooks.json already exists!");
    } catch {
      spinner.succeed("Created .simple-git-hooks.json.");
    }
  };

  await Promise.all([
    execaCommand("git init"),
    writePackageJson(),
    writeConfig(),
  ]);

  await execaCommand("pnpx simple-git-hooks");
  setupSpinner.succeed("simple-git-hooks setup complete.");
};

export const prettier = async () => {
  let prettierSpinner = ora("Installing prettier…").start();
  await execaCommand("pnpm install -D prettier");
  prettierSpinner.succeed("prettier installed.");

  let prettierConfigSpinner = ora("Adding Prettier config…").start();

  try {
    await access(".prettierrc");
    prettierConfigSpinner.warn("Prettier config already exists!");
  } catch {
    await writeFile(".prettierrc", prettierConfig, "utf8");
    prettierConfigSpinner.succeed("Prettier config added.");
  }
};
