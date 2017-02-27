import * as t from './types';
import Scanner from './scanner';

const WHITESPACES = /[ \t]/;
const NUMBERS = /[0-9]/;
const SYMBOLS = /[:?,\[\]{}()+\-/*><=$]/;

const getType = (char) => {
  
  if (WHITESPACES.test(char)) {
    return t.TYPE_WHITESPACE;
  } else if (NUMBERS.test(char)) {
    return t.TYPE_NUMBER;
  } else if (SYMBOLS.test(char)) {
    return t.TYPE_SYMBOLS;
  } else {
    return t.TYPE_STRING;
  }
};

const lexer = (input) => {
  
  if (!input) {
    return [];
  }

  const tokens = [];
  let token = {type: null, value: ''};
  let currMode;
  let prevMode = null;
  const scanner = new Scanner(input);

  let char;
  while ((char = scanner.next()) !== null) {

    if (char.value === '.' && (prevMode === t.TYPE_NUMBER || getType(scanner.nextCharacter()) === t.TYPE_NUMBER)) {
      currMode = t.TYPE_NUMBER;
    } else {
      currMode = getType(char.value);
    }
    
    if (currMode === t.TYPE_SYMBOLS || prevMode !== null && currMode !== prevMode) {
      if (token.value) { // if it's not a sybol on the first iteration
        tokens.push(token);
      }
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
