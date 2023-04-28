import path from "path";
import { Element } from "parse5/dist/tree-adapters/default";
import { Attribute } from "parse5/dist/common/token";
import { Command } from "commander";
import { parseHtml } from "./utils/parse";
import { saveAst } from "./utils/save";
import { ruleChain } from "./rules";
import ruleRemoveEmpty from "./rules/ruleRemoveEmpty";
import ruleRmoveComment from "./rules/ruleRemoveComment";
import walk from "./utils/walk";
import ruleRemoveStyles from "./rules/ruleRemoveStyles";
import compileHandler from "./commands/compile";

const program = new Command("maileeze");
program.description("A html5 email parser and optimizer").version("0.0.1-alpha");

program
  .command("compile")
  .description("Compile your HTML5 email to client compatible responsive email")
  .argument("<filePath>", "The file path of your HTML5 email")
  .option("-o, --output <savePath>", "The output path of your compiled HTML5 email")
  .action((filePath, options) => {
    compileHandler(filePath, options?.output);
  });

program.parse();
