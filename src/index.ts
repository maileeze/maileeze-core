import path from "path";
import { Element } from "parse5/dist/tree-adapters/default";
import { Attribute } from "parse5/dist/common/token";
import { parseHtml } from "./utils/parse";
import { saveAst } from "./utils/save";
import { ruleChain } from "./rules";
import ruleRemoveEmpty from "./rules/ruleRemoveEmpty";
import ruleRmoveComment from "./rules/ruleRemoveComment";
import walk from "./utils/walk";
import ruleRemoveStyles from "./rules/ruleRemoveStyles";

const savePath = path.join(process.cwd(), "test", "out.html");

const ast = parseHtml("index.html");

ruleChain().use(ruleRemoveEmpty).use(ruleRmoveComment).use(ruleRemoveStyles).process(ast);

walk(ast, (node) => {
  const printAttr = (attrs: Attribute[]) => {
    attrs.forEach((attr) => {
      console.log(`\t${attr.name}=${attr.value}`);
    });
  };
  if ((node as Element)?.attrs && (node as Element)?.attrs.length > 0) {
    console.log(`${node.nodeName}: `);
    printAttr((node as Element).attrs);
  }
});

saveAst(savePath, ast);
