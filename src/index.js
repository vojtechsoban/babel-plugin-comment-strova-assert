import {transformJsToAst, serialize} from './utils';
import * as t from './types';
import {parse} from './parser';
export * from './assert';

const assertRegex = /^\s*assert\s+(.*)$/;
const defaultErrorMessage = 'Assertion error';
const defaultAction = t.KEYWORD_NOT_NULL;

const generate = (action, actionArguments, type, nullable = false) => {
  
  if (!action) {
    action = defaultAction;
  }
  
  if (!actionArguments) {
    actionArguments = [];
  }
  
  return `(arg) => sa.assert(arg, '${action}', [${actionArguments.map(serialize)}], null, ${nullable})`;
};

const buildActionFromOpts = (t, strovaAst, action = 'log_error') => {
  
  const message = t.stringLiteral(`${defaultErrorMessage}: ${strovaAst.expression}`);
  
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
  } else if (action === 'log_warn' || action === 'log_warning') {
    return consoleEntry('warn', message);
  } else if (action === 'log_info') {
    return consoleEntry('info', message);
  } else if (action === 'log_debug') {
    return consoleEntry('debug', message);
  } else {
    return consoleEntry('error', message);
  }
};

export default function visitor({types: t, template, transform}) {
  
  const assertTemplate = template('if (!TEST(EXPRESSION)) ACTION');
  
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
              const parsedAssertion = parse(assertMatch[1]);
              const transformedExpression = transformJsToAst(transform, parsedAssertion.expression);
              const transformedTest = transformJsToAst(transform,
                generate(parsedAssertion.action, parsedAssertion.actionArguments, parsedAssertion.type, parsedAssertion.nullable));
              path.insertBefore(
                assertTemplate({
                  EXPRESSION: transformedExpression,
                  TEST: transformedTest,
                  ACTION: buildActionFromOpts(t, parsedAssertion, state.opts.action)
                }));
            }
          }
        }
      },

      Program (path) {
        const transformed = transform('import * as sa from \'strova-assert\';');
        const transformedNode = transformed.ast.program.body[0];
        path.unshiftContainer('body', transformedNode);
      }
    }
  };
}
