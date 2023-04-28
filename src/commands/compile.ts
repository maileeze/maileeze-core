import { Attribute } from "parse5/dist/common/token";
import { Element } from "parse5/dist/tree-adapters/default";
import { ruleChain } from "../rules";
import ruleRmoveComment from "../rules/ruleRemoveComment";
import ruleRemoveEmpty from "../rules/ruleRemoveEmpty";
import ruleRemoveStyles from "../rules/ruleRemoveStyles";
import { parseHtml } from "../utils/parse";
import { saveAst } from "../utils/save";

const compileHandler: CommandHandler = (filePath: string, savePath?: string) => {
  const ast = parseHtml(filePath);
  const localSavePath = savePath ?? `${filePath.slice(0, filePath.lastIndexOf("."))}.out.html`;

  ruleChain().use(ruleRemoveEmpty).use(ruleRmoveComment).use(ruleRemoveStyles).process(ast);

  // walk(ast, (node) => {
  //   const printAttr = (attrs: Attribute[]) => {
  //     attrs.forEach((attr) => {
  //       console.log(`\t${attr.name}=${attr.value}`);
  //     });
  //   };
  //   if ((node as Element)?.attrs && (node as Element)?.attrs.length > 0) {
  //     console.log(`${node.nodeName}: `);
  //     printAttr((node as Element).attrs);
  //   }
  // });

  saveAst(localSavePath, ast);
};

export default compileHandler;
