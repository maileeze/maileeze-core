import { ChildNode, Node } from "parse5/dist/tree-adapters/default";

interface AstProcessor {
  (ast: Node): unknown;
}

interface AstFilter extends AstProcessor {
  (ast: ChildNode): boolean;
}

interface AstReplacer extends AstProcessor {
  (ast: ChildNode): Node;
}

interface AstProcessChain {
  (ast: Node): void;
  add(processor: AstProcessor): void;
}
