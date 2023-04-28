import { Element } from "parse5/dist/tree-adapters/default";
import { defaultTreeAdapter as adapter } from "parse5";

function isBlockElement(node: Element) {
  const blockElements = [
    "div",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hr",
    "li",
    "main",
    "nav",
    "ol",
    "p",
    "pre",
    "section",
    // "table",
    "tfoot",
    "ul",
    "video"
  ];
  return blockElements.indexOf(node.nodeName) !== -1;
}

const ruleTransformDiv: AstRule = (node) => {
  if (adapter.isElementNode(node) === false) return true; // 只处理元素节点(标签)

  const element = node as Element;

  if (element.nodeName === "body") {
    const table = adapter.createElement("table", element.namespaceURI, []);
    table.childNodes = element.childNodes;
    element.childNodes = [table];
    return true;
  }
  // 块级元素
  if (isBlockElement(element)) {
    const rawName = element.nodeName;
    element.nodeName = "tr";
    element.tagName = "tr";
    const td = adapter.createElement("td", element.namespaceURI, element.attrs);
    element.attrs = [];
    td.childNodes = element.childNodes;
    element.childNodes = [td];

    return true;
  }
  return true;
};

export default ruleTransformDiv;
