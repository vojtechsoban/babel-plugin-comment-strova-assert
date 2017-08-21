// TODO reexport messages from strova-assert import {messages} from 'strova-assert';
import * as types from './types';

export const transformJsToAst = (transform, assertExpression) => {
  return transform(`() => (${assertExpression})`).ast.program.body[0].expression;
};

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

const defaultErrorMessage = 'Assertion error';

const buildMessage = (assert, expression, message) => {
  return `${message ? message : defaultErrorMessage}: ${expression}`
};

/**
 *
 * @param expression expression to be tested
 * @param assertFunction notNull, notEmpty, etc. see src/types.js
 * @param actionArguments additional flags, not supported yet
 * @param type JS type: string, number, integer, ....
 * @param nullable flag if tested expression is valid when null
 * @param actionTaken what do do when assertion fails: log error, throw error, ...
 * @param customMessage parsed user custom message: Name must not be empty, etc.
 * @returns {string}
 */
export const generateAssertionCommand = (expression, assertFunction, actionArguments, type, nullable = false, actionTaken = null, customMessage) => {

  if (!assertFunction) {
    assertFunction = types.KEYWORD_NOT_NULL;
  }

  if (!actionArguments) {
    actionArguments = [];
  }

  const message = buildMessage(assertFunction, expression, customMessage);

  switch (assertFunction) {
    case types.KEYWORD_NOT_NULL:
      return `strovaAssert.notNull(${expression}, '${message}')`;
  }

  return `strovaAssert.notEmpty(${expression}, '${message}')`;
};
