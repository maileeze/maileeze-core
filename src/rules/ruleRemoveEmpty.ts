import { Element, TextNode } from "parse5/dist/tree-adapters/default";

const ruleRemoveEmpty: AstRule = (node) => {
  // 清除空文本行
  if (node.nodeName === "#text") {
    const textNode = node as TextNode;
    return textNode.value.trim() !== "";
  }
  // 清除属性为空的标签
  const element = node as Element;
  if (element.attrs) {
    const target = element.attrs.find((item) => item.name === "src" || item.name === "href" || item.name === "content");
    if (target?.value.length === 0) return false;
  }
  return true;
};

export default ruleRemoveEmpty;
