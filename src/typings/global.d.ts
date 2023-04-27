import { ChildNode, Node } from "parse5/dist/tree-adapters/default";

// 由于有引用后全局的类型声明就会变成模块，所以要包在namespace里由其他地方引用和导出
declare namespace GlobalType {
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
}

export = GlobalType;
export as namespace GlobalType;
