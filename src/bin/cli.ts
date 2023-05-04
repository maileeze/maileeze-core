#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import compileHandler from "../commands/compile";
import readPackageInfo from "../utils/config";

const packageInfo = readPackageInfo();

const program = new Command().name(packageInfo.name).version(packageInfo.version);

if (packageInfo.description) {
  const description = `${chalk.bgGreen.italic.bold(packageInfo.name)}: ${chalk.whiteBright(packageInfo.description)}`;
  program.description(description);
}

// const help = program.createHelp();

program
  .command("compile")
  .description("Compile your HTML5 email to client compatible responsive email")
  .argument("<filePath>", "The file path of your HTML5 email")
  .option("-o, --output <savePath>", "The output path of your compiled HTML5 email")
  .action((filePath, options) => {
    compileHandler(filePath, options?.output);
  });

program.parse();

export default program;
