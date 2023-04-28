import { ruleChain } from "../rules";
import ruleRmoveComment from "../rules/ruleRemoveComment";
import ruleRemoveEmpty from "../rules/ruleRemoveEmpty";
import ruleRemoveStyles from "../rules/ruleRemoveStyles";
import ruleTransformDiv from "../rules/ruleTransformDiv";
import { parseHtml } from "../utils/parse";
import { saveAst } from "../utils/save";

const compileHandler: CommandHandler = (filePath: string, savePath?: string) => {
  const ast = parseHtml(filePath);
  const localSavePath = savePath ?? `${filePath.slice(0, filePath.lastIndexOf("."))}.out.html`;

  ruleChain().use(ruleRemoveEmpty).use(ruleRmoveComment).use(ruleRemoveStyles).use(ruleTransformDiv).process(ast);

  saveAst(localSavePath, ast);
};

export default compileHandler;
