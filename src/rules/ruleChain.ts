import { AstFilter, AstProcessChain, AstProcessor, AstReplacer } from "..";

class RuleChain implements AstProcessChain {
  private ast: Node;

  private filters: AstFilter[] = [];

  private replacers: AstReplacer[] = [];

  constructor(ast: Node) {
    this.ast = ast;
  }

  add(processor: AstProcessor): void {
    throw new Error("Method not implemented.");
  }

  (ast: Node): void {
    throw new Error("Method not implemented.");
  }
}
