import { Node, ParentNode } from "parse5/dist/tree-adapters/default";
import walk from "../utils/walk";
import { isAstFilter, isAstReplace } from "../typings/check";

export class RuleChain implements AstProcess {
  private filters: AstFilter[] = [];

  private replacers: AstReplace[] = [];

  private callbackFn: WalkerCallback = (node) => {
    // 首先按照规则清理节点
    const p = node as ParentNode;
    if (p.childNodes) {
      p.childNodes = p.childNodes.filter((child) => {
        let ret = true;
        // 之所以这样设计是想通过一次遍历来筛选 而不是每个filter都遍历一遍
        for (let i = 0; i < this.filters.length; i += 1) {
          if (!this.filters[i](child)) {
            ret = false;
            break; // 本节点一定会删除就不用再检查了
          }
        }
        return ret;
      });
      // 然后再进行替换工作
      for (let i = 0; i < this.replacers.length; i += 1) {
        this.replacers[i](node);
      }
    }
  };

  public use(rule: AstRule): RuleChain {
    if (isAstFilter(rule)) this.filters.push(rule);
    else if (isAstReplace(rule)) this.replacers.push(rule);
    return this;
  }

  public process(node: Node): Node {
    walk(node, this.callbackFn);
    return node;
  }
}

export const ruleChain = () => new RuleChain();
