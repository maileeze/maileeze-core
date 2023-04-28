import { writeFileSync, existsSync, mkdirSync } from "fs";
import { serialize } from "parse5";
import { Document } from "parse5/dist/tree-adapters/default";
import path from "path";

function checkAndMakeDir(dirPath: string) {
  const parentDir = dirPath.slice(0, dirPath.lastIndexOf("\\") === -1 ? dirPath.lastIndexOf("/") : dirPath.lastIndexOf("\\"));
  if (parentDir.length === 0) throw Error(`Invalid path: ${dirPath}`);
  if (!existsSync(parentDir)) {
    checkAndMakeDir(parentDir);
  }
  if (!existsSync(dirPath)) mkdirSync(dirPath);
}

export function saveHtml(fp: string, html: string) {
  const dir = path.dirname(path.resolve(fp));
  checkAndMakeDir(dir);
  writeFileSync(fp, html);
  console.log(`Saved to ${fp}`);
}

export function saveAst(fp: string, ast: Document) {
  const html = serialize(ast);
  saveHtml(fp, html);
}
