import { TextNode } from "parse5/dist/tree-adapters/default";

const ruleRemoveEmpty: AstFilter = (node) => {
  if (node.nodeName === "#text") {
    const textNode = node as TextNode;
    return textNode.value.trim() !== "";
  }
  // if (node.nodeName === "script") {
  //   return false;
  // }
  return true;
};

export default ruleRemoveEmpty;
