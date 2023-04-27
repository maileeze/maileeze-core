import { Document, Node, ParentNode } from "parse5/dist/tree-adapters/default";

export default function walk(node: Node, callback?: (element: Node) => void) {
  if (callback) callback(node);
  if (node.nodeName === "#document") {
    const ast = node as Document;
    ast.childNodes.forEach((child) => {
      walk(child, callback);
    });
  } else {
    const parent = node as ParentNode;
    if (parent.childNodes) {
      parent.childNodes.forEach((child) => {
        walk(child, callback);
      });
    }
  }
}
