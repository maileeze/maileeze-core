import { Parser, ParserError, ParserOptions } from "parse5";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { DefaultTreeAdapterMap } from "parse5/dist/tree-adapters/default";

function throwFileOException(p: string) {
  throw new Error(`File is not found at "${p}"`);
}

const tryFolders = ["src", "test", path.join("src", "test")];

export function parseHtml(arg: string) {
  const pwd = process.cwd();

  let filePath = arg;
  let i = 0;
  while (!existsSync(filePath)) {
    if (i >= tryFolders.length) throwFileOException(arg);
    filePath = path.join(pwd, tryFolders[i], arg);
    i += 1;
  }

  const rawFile = readFileSync(filePath, "utf-8");

  const parseOption: ParserOptions<DefaultTreeAdapterMap> = {
    onParseError: (err: ParserError) => {
      throw err;
    }
  };
  return Parser.parse<DefaultTreeAdapterMap>(rawFile, parseOption);
}
