import { Node, ParentNode, TextNode } from "parse5/dist/tree-adapters/default";
import { parseHtml } from "./utils/parse";
import { saveAst } from "./utils/save";
import walk from "./utils/walk";

const ast = parseHtml("index.html");
const fn = (node: Node) => {
  const p = node as ParentNode;
  if (p.childNodes) {
    p.childNodes = p.childNodes.filter((child) => {
      if (child.nodeName === "#comment") {
        return false;
      }
      if (child.nodeName === "#text") {
        const textNode = child as TextNode;
        return textNode.value.trim() !== "";
      }
      return true;
    });
  }
};

walk(ast, fn);

saveAst("D:\\web\\maileeze\\maileeze-compiler\\test\\out.html", ast);
