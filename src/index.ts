import path from "path";
import { parseHtml } from "./utils/parse";
import { saveAst } from "./utils/save";
import { ruleChain } from "./rules";
import ruleRemoveEmpty from "./rules/ruleRemoveEmpty";
import ruleRmoveComment from "./rules/ruleRemoveComment";
import walk from "./utils/walk";

const savePath = path.join(process.cwd(), "test", "out.html");

const ast = parseHtml("index.html");

ruleChain().use(ruleRemoveEmpty).use(ruleRmoveComment).process(ast);

walk(ast, (node) => {
  console.log(node.nodeName);
});

saveAst(savePath, ast);
