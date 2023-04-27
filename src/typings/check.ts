import { Node } from "parse5/dist/tree-adapters/default";

export function isAstFilter(rule: AstRule): rule is AstFilter {
  return typeof rule === "function" && rule.length === 1 && typeof rule({} as Node) === "boolean";
}

export function isAstReplace(rule: AstRule): rule is AstReplace {
  return typeof rule === "function" && rule.length === 1 && rule({} as Node) instanceof Node;
}
