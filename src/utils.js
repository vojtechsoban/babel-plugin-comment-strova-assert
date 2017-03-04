export const transformJsToAst = (transform, assertExpression) => {
  return transform(`() => (${assertExpression})`).ast.program.body[0].expression.body;
};

export const markString = (input, position) => (
  input.substr(0, position)
  + '__'
  + input.charAt(position)
  + '__'
  + input.substr(position - input.length + 1)
);
