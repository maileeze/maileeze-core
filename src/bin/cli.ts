#!/usr/bin/env node

import { Command } from "commander";
import compileHandler from "../commands/compile";
import readPackageInfo from "../utils/config";

const packageInfo = readPackageInfo();

const program = new Command(packageInfo.name).version(packageInfo.version);

if (packageInfo.description) {
  program.description(packageInfo.description);
}

program
  .command("compile")
  .description("Compile your HTML5 email to client compatible responsive email")
  .argument("<filePath>", "The file path of your HTML5 email")
  .option("-o, --output <savePath>", "The output path of your compiled HTML5 email")
  .action((filePath, options) => {
    compileHandler(filePath, options?.output);
  });

program.parse();
