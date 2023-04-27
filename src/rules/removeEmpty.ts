import { TextNode } from "parse5/dist/tree-adapters/default";

const removeEmpty: AstFilter = (node) => {
  if (node.nodeName === "#text") {
    const textNode = node as TextNode;
    return textNode.value.trim() !== "";
  }
  return true;
};

export default removeEmpty;
