import * as t from './types';
import Scanner from './scanner';

const WHITESPACES = /[ \t]/;
const NUMBERS = /[0-9]/;
const STRINGS = /[a-zA-Z0-9]/;
const OPERATORS = /[+\-/*><]/;
const BRACKETS = /[\[\]{}()]/;
const SPECIAL_CHARACTERS = /[:?,]/;

const getType = (charObj) => {
  
  const char = charObj.value;
  
  if (WHITESPACES.test(char)) {
    return t.TYPE_WHITESPACE;
  } else if (NUMBERS.test(char)) {
    return t.TYPE_NUMBER;
  } else if (STRINGS.test(char)) {
    return t.TYPE_STRING;
  } else if (char === '.') {
    return t.TYPE_DECIMAL_POINT;
  } else if (OPERATORS.test(char)) {
    return t.TYPE_OPERATORS;
  } else if (BRACKETS.test(char)) {
    return t.TYPE_BRACKETS;
  } else if (SPECIAL_CHARACTERS.test(char)) {
    return t.TYPE_SPECIAL_CHARACTERS;
  } else {
    throw new Error(`Unsupported char '${char}' ordinal=${char.charCodeAt(0)} at column=${charObj.column}`);
  }
};

const lexer = (input) => {

  const tokens = [];
  let token = {type: null, value: ''};
  let currMode;
  let prevMode = null;
  const scanner = new Scanner(input);

  let char;
  while ((char = scanner.next()) !== null) {

    currMode = getType(char);

    // Also check sign
    if (currMode === t.TYPE_DECIMAL_POINT && prevMode === t.TYPE_NUMBER) {
      currMode = prevMode;
    }

    if (prevMode !== null && currMode !== prevMode) {
      tokens.push(token);
      token = {type: currMode, value: char.value};
    } else {
      token.type = currMode;
      token.value += char.value;
    }

    prevMode = currMode;
  }

  tokens.push(token);

  return tokens;
};

export default lexer;
