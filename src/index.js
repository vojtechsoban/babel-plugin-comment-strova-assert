import {transformJsToAst, generateAssertionCommand} from './utils';
import {parse} from './parser';

const assertRegex = /^\s*assert\s+(.*)$/;

export default function visitor({types: t, template, transform}) {

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
              path.insertBefore(transformJsToAst(transform, generateAssertionCommand(parsedAssertion.expression, parsedAssertion.action,
                   parsedAssertion.actionArguments, parsedAssertion.type, parsedAssertion.nullable, state.opts.action, parsedAssertion.message)));
            }
          }
        }
      },

      Program(path) {
        const transformed = transform('import * as strovaAssert from \'strova-assert\';');
        const transformedNode = transformed.ast.program.body[0];
        path.unshiftContainer('body', transformedNode);
      }
    }
  };
}
