import { Element } from "parse5/dist/tree-adapters/default";

const ruleRemoveStyles: AstNodeEditor = (node) => {
  const element = node as Element;
  if (element.attrs && element.attrs.length > 0) {
    element.attrs = element.attrs.filter((attr) => {
      if (attr.name === "class") return false;
      if (attr.name === "rel" && attr.value === "stylesheet") return false;
      if (element.nodeName === "link" && attr.name === "href" && attr.value.endsWith("css")) return false;
      return true;
    });
  }
  return true;
};

export default ruleRemoveStyles;
