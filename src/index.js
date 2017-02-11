const assertRegex = /^\s*assert\s+(.*)$/;
const defaultErrorMessage = 'Assertion error';

const buildActionFromOpts = (t, assertExpression, action = 'log_error') => {
  
  const message = t.stringLiteral(`${defaultErrorMessage}: ${assertExpression}`);
  
  const consoleEntry = (action, message) => (
    t.callExpression(
      t.memberExpression(
        t.identifier('console'),
        t.identifier(action)
      ),
      [message]
    )
  );
  
  if (action === 'throw') {
    return t.throwStatement(
      t.newExpression(
        t.identifier('Error'),
        [message]
      )
    );
  } else if (action === 'log_error') {
    return consoleEntry('error', message);
  } if (action === 'log_warn' || action === 'log_warning') {
    return consoleEntry('warn', message);
  } if (action === 'log_info') {
    return consoleEntry('info', message);
  } else if (action === 'log_debug') {
    return consoleEntry('debug', message);
  } else {
    return consoleEntry('error', message);
  }
};

export default function visitor({types: t, template, transform}) {
  
  const assertTemplate = template('if (!(EXPRESSION)) ACTION');
  
  return {
    visitor: {
      ['ExpressionStatement|VariableDeclaration|ReturnStatement'](path, state) {
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
              //   path.insertBefore(assertTemplate({EXPRESSION: transformedExpression, MESSAGE: t.stringLiteral(`${defaultErrorMessage}:
              // ${assertExpression}`)})); } else { path.replaceWith(assertTemplate({EXPRESSION: transformedExpression, MESSAGE:
              // t.stringLiteral(`${defaultErrorMessage}: ${assertExpression}`)})); }
              path.insertBefore(
                assertTemplate({EXPRESSION: transformedExpression, ACTION: buildActionFromOpts(t, assertExpression, state.opts.action)}));
            }
          }
        }
      },
    },
  };
}
