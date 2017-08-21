import * as msg from 'strova-assert/messages';
import * as types from './types';

export const transformJsToAst = (transform, assertExpression) => (
  transform(assertExpression).ast.program.body[0].expression
);

export const serialize = arg => {
 if (arg === null || arg === undefined) {
   return 'null';
 } else if (typeof arg === 'string') {
   return `'${arg}'`;
 } else {
   return arg;
 }
};

export const markString = (input, position) => (
  input.substr(0, position)
  + '__'
  + input.charAt(position)
  + '__'
  + input.substr(position - input.length + 1)
);

const buildMessage = (message, defaultMessage, expression) => {
  return message ? message : `${defaultMessage}: ${expression}`;
};

/**
 *
 * @param expression expression to be tested
 * @param action notNull, notEmpty, etc. see src/types.js
 * @param actionArguments additional flags, not supported yet
 * @param type JS type: string, number, integer, ....
 * @param nullable flag if tested expression is valid when null
 * @param actionTaken what do do when assertion fails: log error, throw error, ...
 * @param message parsed user custom message: Name must not be empty, etc.
 * @returns {string}
 */
export const generateAssertionCommand = ({expression, action, actionArguments, nullable, type, message}, actionTaken = null) => {

  if (!action) {
    action = types.KEYWORD_NOT_NULL;
  }

  if (!actionArguments) {
    actionArguments = [];
  }

  const actionStr = actionTaken ? `, action: strovaAssert.${mapPluginActionToAsserAction(actionTaken)}` : '';

  switch (action) {
    case types.KEYWORD_NOT_NULL:
      return `strovaAssert.notNull(${expression}, {message: '${buildMessage(message, msg.NOT_NULL, expression)}'${actionStr}})`;
    case types.KEYWORD_NOT_EMPTY:
      return `strovaAssert.notEmpty(${expression}, {message: '${buildMessage(message, msg.NOT_EMPTY, expression)}'${actionStr}})`;
    case types.KEYWORD_NOT_BLANK:
      return `strovaAssert.notBlank(${expression}, {message: '${buildMessage(message, msg.NOT_BLANK, expression)}'${actionStr}})`;
  }

  throw new Error(`Can't generate assertion statement from unsupported action: ${action}`);
};

const assertActionsMap = new Map();
assertActionsMap.set('default', 'logError');
assertActionsMap.set('log_info', 'logInfo');
assertActionsMap.set('log_warn', 'logWarn');
assertActionsMap.set('log_warning', 'logWarn');
assertActionsMap.set('log_error', 'logError');
assertActionsMap.set('throw', 'throwError');
assertActionsMap.set('noop', 'noop');

const mapPluginActionToAsserAction = action => {
  if (!assertActionsMap.has(action)) {
    throw new Error(`Unsupported action: ${action}, supported actions: [${Array.from(assertActionsMap.keys())}]`);
  }
  return assertActionsMap.get(action);
};
