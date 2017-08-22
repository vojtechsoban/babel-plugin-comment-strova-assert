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
              // remove leading comment which is assertion expression: // assert notNull arg1
              leadingComments.splice(i--, 1);
              // parse assertion expression
              const parsedAssertion = parse(assertMatch[1]);
              // insert translated assertion expession to strova-assert statement:
              // assert notNull arg1 --> strovaAssert.notNull(arg1)
              path.insertBefore(transformJsToAst(transform, generateAssertionCommand(parsedAssertion, state.opts.action)));
              // simple hack to insert new line and semicolon, otherwise semicolon couuld be part of generated command,
              // but multiple command would be on one line
              path.insertBefore(t.emptyStatement());
            }
          }
        }
      },

      Program(path) {
        const transformed = transform('import strovaAssert from \'strova-assert\';');
        const transformedNode = transformed.ast.program.body[0];
        path.unshiftContainer('body', transformedNode);
      }
    }
  };
}
