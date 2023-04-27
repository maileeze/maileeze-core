const ruleRmoveComment: AstRule = (node) => {
  if (node.nodeName === "#comment") return false;
  return true;
};

export default ruleRmoveComment;
