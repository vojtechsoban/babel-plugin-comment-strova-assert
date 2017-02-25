import * as t from './types';
import lexer from './lexer';

const getTokens = (input) => {
  try {
    return lexer(input);
  } catch (e) {
    throw new Error(`Can't process input='${input}': ${e.message}`);
  }
};

export const parse = (input) => {

  const isKeyword = (value) => (t.KEYWORDS.indexOf(value) >= 0);
  
  const getModeForKeyword = (keyword) => {
    if (t.SIMPLE_KEYWORDS.includes(keyword)) {
      return t.MODE_COLLECTING_TYPE_OR_MESSAGE;
    } else {
      throw new Error(`Unsupported keyword='${keyword}', don't know what to do next.`);
    }
  };
  
  let parserMode = t.MODE_COLLECTING_EXPRESSION;
  let expression = '';
  let action = null;
  let type = '';
  let message = '';

  for (const chunk of getTokens(input)) {

    if (parserMode === t.MODE_COLLECTING_MESSAGE) {
      // append only when some character exists so that leading white spaces are ignored
      if (message || !message && chunk.type !== t.TYPE_WHITESPACE) {
        message += chunk.value;
      }
    } else if (parserMode === t.MODE_COLLECTING_TYPE_OR_MESSAGE && chunk.type === t.TYPE_SPECIAL_CHARACTERS && chunk.value === ':') {
      parserMode = t.MODE_COLLECTING_MESSAGE;
    } else if (parserMode === t.MODE_COLLECTING_TYPE_OR_MESSAGE && chunk.type === t.TYPE_BRACKETS && chunk.value === '{') {
      if (type) {
        throw new Error(`Unexpected '{' - type '${type}' is already found.`);
      }
      parserMode = t.MODE_COLLECTING_TYPE;
    } else if (parserMode === t.MODE_COLLECTING_TYPE && chunk.type !== t.TYPE_BRACKETS && chunk.value !== '}') {
      if (chunk.type !== t.TYPE_WHITESPACE) {
        type += chunk.value;
      }
    } else if (parserMode === t.MODE_COLLECTING_TYPE && chunk.type === t.TYPE_BRACKETS && chunk.value === '}') {
      parserMode = t.MODE_COLLECTING_TYPE_OR_MESSAGE;
    } else if (parserMode === t.MODE_COLLECTING_EXPRESSION && chunk.type === t.TYPE_STRING && isKeyword(chunk.value)) {
      action = chunk.value;
      parserMode = getModeForKeyword(action);
    } else if (parserMode === t.MODE_COLLECTING_EXPRESSION && chunk.value === '{') {
      parserMode = t.MODE_COLLECTING_TYPE;
    } else if (parserMode === t.MODE_COLLECTING_EXPRESSION && chunk.value === ':') {
      parserMode = t.MODE_COLLECTING_MESSAGE;
    } else if (parserMode === t.MODE_COLLECTING_EXPRESSION && chunk.type !== t.TYPE_WHITESPACE) {
      expression += chunk.value;
    }
  }
  
  if (!type) {
    type = null;
  }
  
  if (!message) {
    message = null;
  }
  
  return {
    expression, action, type, message
  }
};

export default parse;
