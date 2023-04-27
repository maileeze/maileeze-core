import { Node, ParentNode } from "parse5/dist/tree-adapters/default";
import walk from "../utils/walk";

export class RuleChain implements AstProcess {
  private rules: AstRule[] = [];

  private callbackFn: WalkerCallback = (node) => {
    // 这个逻辑下只用判断子节点，如果没有子节点就直接跳过
    const p = node as ParentNode;
    if (p.childNodes) {
      p.childNodes = p.childNodes.filter((child) => {
        // 判断它的每个子节点，节点本身在父节点中已经被判断过了
        let ret = true;
        for (let i = 0; i < this.rules.length; i += 1) {
          // 这里分别对子节点运行每个规则，规则既有确定节点是否保留，也有修改节点内容的
          const preserveNode = this.rules[i](child);
          if (!preserveNode) {
            ret = false; // 如果判断为删除就不用再运行后续了
            break;
          }
        }
        return ret;
      });
    }
  };

  public use(rule: AstRule): RuleChain {
    this.rules.push(rule);
    return this;
  }

  public process(node: Node): Node {
    walk(node, this.callbackFn);
    return node;
  }
}

export const ruleChain = () => new RuleChain();
