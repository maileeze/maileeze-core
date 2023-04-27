import { ChildNode, Node } from "parse5/dist/tree-adapters/default";

// 由于有引用后全局的类型声明就会变成模块，所以要包在namespace里由其他地方引用和导出
declare namespace GlobalType {
  interface AstRule {
    (node: Node): unknown;
  }

  interface AstFilter extends AstRule {
    (node: ChildNode): boolean;
  }

  interface AstReplace extends AstRule {
    (node: ChildNode): Node;
  }

  interface AstProcess {
    use(processor: AstRule): AstProcess; // use支持链式调用
    process(node: Node): Node; // process一定在最后一个，不支持链式
  }

  interface WalkerCallback {
    (node: Node): void;
  }
}

export = GlobalType;
export as namespace GlobalType;
