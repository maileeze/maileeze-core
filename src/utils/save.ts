import { writeFileSync, existsSync, mkdirSync } from "fs";
import { serialize } from "parse5";
import { Document } from "parse5/dist/tree-adapters/default";

function checkAndMakeDir(dirPath: string) {
  const parentDir = dirPath.slice(0, dirPath.lastIndexOf("\\") === -1 ? dirPath.lastIndexOf("/") : dirPath.lastIndexOf("\\"));
  if (!existsSync(parentDir)) {
    checkAndMakeDir(parentDir);
  }
  if (!existsSync(dirPath)) mkdirSync(dirPath);
}

export function saveHtml(fp: string, html: string) {
  const dir = fp.slice(0, fp.lastIndexOf("\\") === -1 ? fp.lastIndexOf("/") : fp.lastIndexOf("\\"));
  checkAndMakeDir(dir);
  writeFileSync(fp, html);
}

export function saveAst(fp: string, ast: Document) {
  const html = serialize(ast);
  saveHtml(fp, html);
}
