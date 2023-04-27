import { Parser, ParserError, ParserOptions, TreeAdapterTypeMap } from "parse5";
import { readFileSync, existsSync } from "fs";
import path from "path";
import {
  Node,
  ParentNode,
  ChildNode,
  Document,
  DocumentFragment,
  Element,
  CommentNode,
  TextNode,
  Template,
  DocumentType
} from "parse5/dist/tree-adapters/default";

// 泛型顺序：Node, ParentNode, ChildNode, Document, DocumentFragment, Element, CommentNode, TextNode, Template, DocumentType
type MailTreeAdapterTypeMap = TreeAdapterTypeMap<
  Node,
  ParentNode,
  ChildNode,
  Document,
  DocumentFragment,
  Element,
  CommentNode,
  TextNode,
  Template,
  DocumentType
>;

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

  const parseOption: ParserOptions<MailTreeAdapterTypeMap> = {
    onParseError: (err: ParserError) => {
      throw err;
    }
  };
  return Parser.parse<MailTreeAdapterTypeMap>(rawFile, parseOption);
}
