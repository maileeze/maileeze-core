// 一种曲线救国方案

type AstRule = GlobalType.AstRule;
interface AstNodeEditor extends AstRule {
  (node: Node): true;
}
type AstProcess = GlobalType.AstProcess;
type WalkerCallback = GlobalType.WalkerCallback;
