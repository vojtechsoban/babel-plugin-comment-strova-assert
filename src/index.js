import {transformJsToAst, serialize} from './utils';
import {KEYWORD_NOT_NULL} from './types';
import {parse} from './parser';
export * from './assert'; // re-export so that it could be used in generated code

const assertRegex = /^\s*assert\s+(.*)$/;
const defaultErrorMessage = 'Assertion error';

const generateAssertionCommand = (assertionAction, actionArguments, type, nullable = false) => {

  if (!assertionAction) {
    assertionAction = KEYWORD_NOT_NULL;
  }

  if (!actionArguments) {
    actionArguments = [];
  }

  return `(arg) => sa.assert(arg, '${assertionAction}', [${actionArguments.map(serialize)}], null, ${nullable})`;
};

const buildActionFromOpts = (t, strovaAst, actionTaken = 'log_error') => {

  const message = t.stringLiteral(`${strovaAst.message ? strovaAst.message : defaultErrorMessage}: ${strovaAst.expression}`);

  const consoleEntry = (action, message) => (
    t.callExpression(
      t.memberExpression(
        t.identifier('console'),
        t.identifier(action)
      ),
      [message]
    )
  );

  if (actionTaken === 'throw') {
    return t.throwStatement(
      t.newExpression(
        t.identifier('Error'),
        [message]
      )
    );
  } else if (actionTaken === 'log_error') {
    return consoleEntry('error', message);
  } else if (actionTaken === 'log_warn' || actionTaken === 'log_warning') {
    return consoleEntry('warn', message);
  } else if (actionTaken === 'log_info') {
    return consoleEntry('info', message);
  } else if (actionTaken === 'log_debug') {
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
                generateAssertionCommand(parsedAssertion.action, parsedAssertion.actionArguments, parsedAssertion.type, parsedAssertion.nullable));
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

      Program(path) {
        const transformed = transform('import * as sa from \'strova-assert\';');
        const transformedNode = transformed.ast.program.body[0];
        path.unshiftContainer('body', transformedNode);
      }
    }
  };
}
