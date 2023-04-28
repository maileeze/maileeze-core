import { Element, Node, ChildNode } from "parse5/dist/tree-adapters/default";
import { defaultTreeAdapter as adapter } from "parse5";

function isBlockElement(node: Node) {
  const blockElements = [
    "address",
    "article",
    "aside",
    "blockquote",
    "canvas",
    "dd",
    "div",
    "dl",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    // "hr", // 分割线
    "li",
    "main",
    "nav",
    "noscript",
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

function isInlineElement(node: Node) {
  const inlineElements = [
    "a",
    "abbr",
    "acronym",
    "b",
    "bdi",
    "bdo",
    "big",
    "br",
    "button",
    "cite",
    "code",
    "data",
    "datalist",
    "del",
    "dfn",
    "em",
    "i",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "map",
    "mark",
    "meter",
    "noscript",
    "object",
    "output",
    "picture",
    "progress",
    "q",
    "ruby",
    "s",
    "samp",
    "script",
    "select",
    "slot",
    "small",
    "span",
    "strong",
    "sub",
    "sup",
    "svg",
    "template",
    "textarea",
    "time",
    "u",
    "tt",
    "var",
    "video",
    "wbr"
  ];
  return inlineElements.indexOf(node.nodeName) !== -1;
}

const tableLayout = "table-layout: fixed; border-collapse: collapse; border-spacing: 0; margin: 0; overflow: hidden; padding: 0";

function createTable(node: Element) {
  const table = adapter.createElement("table", node.namespaceURI, []);
  table.attrs.push({ name: "style", value: tableLayout });
  table.childNodes = node.childNodes;
  for (let i = 0; i < table.childNodes.length; i += 1) {
    table.childNodes[i].parentNode = table;
  }
  table.parentNode = node;
  // console.log(table);
  return table;
}

const ruleTransformDiv: AstRule = (node) => {
  if (adapter.isElementNode(node) === false) return true; // 只处理元素节点(标签)

  const element = node as Element;

  if (element.nodeName === "body") {
    const table = createTable(element);
    element.childNodes = [table];
    return true;
  }
  // 块级元素
  if (isBlockElement(element)) {
    const rawName = element.nodeName;

    // 先创建tr, td
    element.nodeName = "tr";
    element.tagName = "tr";
    const td = adapter.createElement("td", element.namespaceURI, element.attrs);
    td.parentNode = element;
    element.attrs = [];

    let children: ChildNode[] = element.childNodes;
    let parent = td;
    // 判断需不需要建表
    if (element.nodeName === "section") {
      const subTable = createTable(element);
      children = [subTable];
      parent = subTable;
    } else {
      let divCount = 0;
      for (let i = 0; i < element.childNodes.length; i += 1) {
        if (isBlockElement(element.childNodes[i])) divCount += 1;
        if (divCount > 1) break; // 只要有两个块级元素就建表
      }
      if (divCount > 1) {
        const subTable = createTable(element);
        children = [subTable];
        parent = subTable;
      }
    }
    td.childNodes = children;
    if (parent === td) {
      for (let i = 0; i < td.childNodes.length; i += 1) {
        td.childNodes[i].parentNode = td;
      }
    }
    element.childNodes = [td];
    return true;
  }

  if (isInlineElement(element)) {
    // 行内元素如果是裸露的就包一层;
    if (element.parentNode && element.parentNode.nodeName !== "td") {
      if (element.parentNode.nodeName === "tr") {
        const rawName = element.nodeName;
        console.log(rawName);
        element.nodeName = "td";
        element.tagName = "td";
        // 把内容搬到子层级里
        const child = adapter.createElement(rawName, element.namespaceURI, element.attrs);
        child.parentNode = element;
        child.childNodes = element.childNodes;
        element.attrs = [];
        element.childNodes = [child];
      } else if (element.parentNode.nodeName === "table") {
        const rawName = element.nodeName;
        element.nodeName = "tr";
        element.tagName = "tr";
        const td = adapter.createElement("td", element.namespaceURI, []);
        td.parentNode = element;
        const child = adapter.createElement(rawName, element.namespaceURI, element.attrs);
        element.attrs = [];
        child.parentNode = td;
        child.childNodes = element.childNodes;
        td.childNodes = [child];
        element.childNodes = [td];
      }
      return true;
    }
    return true;
  }

  return true;
};

export default ruleTransformDiv;
