class RuleChain implements AstProcessChain {
  private ast: Node;

  private filters: AstFilter[] = [];

  private replacers: AstReplacer[] = [];

  add(processor: AstProcessor): void {
    throw new Error("Method not implemented.");
  }

  (ast: Node): void {
    throw new Error("Method not implemented.");
  }
}
