import path from "path";
import { parseHtml } from "./utils/parse";
import { saveAst } from "./utils/save";
import { ruleChain } from "./rules";
import ruleRemoveEmpty from "./rules/ruleRemoveEmpty";
import ruleRmoveComment from "./rules/ruleRemoveComment";
import walk from "./utils/walk";

const ast = parseHtml("index.html");
const savePath = path.join(process.cwd(), "test", "out.html");
ruleChain().use(ruleRemoveEmpty).use(ruleRmoveComment).process(ast);
walk(ast, (node) => {
  console.log(node.nodeName);
});
saveAst(savePath, ast);
