#!/usr/bin/env node

import meow from "meow";
import { runCommands } from "./actions.js";

export const cli = meow(
  `
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
`,
  {
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
      version: {
        type: "boolean",
        alias: "v",
      },
    },
  }
);

export type Cli = typeof cli;

runCommands(cli);
