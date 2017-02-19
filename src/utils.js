
export const transformJsToAst = (transform, assertExpression) => {
  return transform(`() => (${assertExpression})`).ast.program.body[0].expression.body;
};
