const assertRegex = /^\s*assert\s+(.*)$/;
const defaultErrorMessage = 'Assertion error';

export default function visitor({types: t, template, transform}) {
  const assertTemplate = template(`if (!(EXPRESSION)) console.error(MESSAGE)`);

  return {
    visitor: {
      ['ExpressionStatement|VariableDeclaration|ReturnStatement'](path) {
        const leadingComments = path.node.leadingComments;
        if (leadingComments && leadingComments.length) {
          for (let i = 0; i < leadingComments.length; i++) {
            const comment = leadingComments[i].value;
            const assertMatch = comment.match(assertRegex);
            if (assertMatch) {
              leadingComments.splice(i--, 1);
              const assertExpression = assertMatch[1];
              const transformedExpression = transform(`() => (${assertExpression})`).ast.program.body[0].expression.body;
              const child = path.node.expression;
              // if (t.isCallExpression(child)) {
              //   path.insertBefore(assertTemplate({EXPRESSION: transformedExpression, MESSAGE: t.stringLiteral(`${defaultErrorMessage}: ${assertExpression}`)}));
              // } else {
              //   path.replaceWith(assertTemplate({EXPRESSION: transformedExpression, MESSAGE: t.stringLiteral(`${defaultErrorMessage}: ${assertExpression}`)}));
              // }
              path.insertBefore(assertTemplate({EXPRESSION: transformedExpression, MESSAGE: t.stringLiteral(`${defaultErrorMessage}: ${assertExpression}`)}));
            }
          }
        }
      },
    },
  };
}
