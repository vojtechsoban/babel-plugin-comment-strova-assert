const KEYWORD_NOT_EMPTY = 'notEmpty';
const KEYWORD_NOT_BLANK = 'notBlank';
const KEYWORD_NULLABLE = 'nullable';

const KEYWORDS = [KEYWORD_NOT_EMPTY, KEYWORD_NOT_BLANK, KEYWORD_NULLABLE];
const SIMPLE_KEYWORDS = [KEYWORD_NOT_BLANK, KEYWORD_NOT_EMPTY, KEYWORD_NULLABLE];

// Parser modes
const MODE_COLLECTING_EXPRESSION = 'collecting_expression';
const MODE_COLLECTING_MESSAGE = 'collecting_message';
const MODE_COLLECTING_TYPE = 'collecting_type';
const MODE_COLLECTING_TYPE_OR_MESSAGE = 'search_type_or_message';

const TYPE_WHITESPACE = 'whitespace';
const TYPE_NUMBER = 'number';
const TYPE_STRING = 'string';
const TYPE_OPERATORS = 'operator';
const TYPE_DECIMAL_POINT = 'decimal_point';
const TYPE_BRACKETS = 'brackets';
const TYPE_SPECIAL_CHARACTERS = 'special_character';

const WHITESPACES = /[ \t]/;
const NUMBERS = /[0-9]/;
const STRINGS = /[a-zA-Z0-9]/;
const OPERATORS = /[+\-/*]/;
const BRACKETS = /[\[\]{}()]/;
const SPECIAL_CHARACTERS = /[:?,]/;

const getType = (char) => {
  if (WHITESPACES.test(char)) {
    return TYPE_WHITESPACE;
  } else if (NUMBERS.test(char)) {
    return TYPE_NUMBER;
  } else if (STRINGS.test(char)) {
    return TYPE_STRING;
  } else if (char === '.') {
    return TYPE_DECIMAL_POINT;
  } else if (OPERATORS.test(char)) {
    return TYPE_OPERATORS;
  } else if (BRACKETS.test(char)) {
    return TYPE_BRACKETS;
  } else if (SPECIAL_CHARACTERS.test(char)) {
    return TYPE_SPECIAL_CHARACTERS;
  } else {
    throw new Error(`Unsupported char '${char}' ordinal=${char.charCodeAt(0)}`);
  }
};

export const parse = (input) => {
  
  // scanner & lexer begin
  
  const chunks = [];
  let chunk = {type: null, value: ''};
  let currMode;
  let prevMode = null;

  for (const char of input) {
    currMode = getType(char);
    
    // TODO transform this loop to 'scanner' which is able to tranverse back and determine if the decimal point is part of a number.
    // Also check sign
    if (currMode === TYPE_DECIMAL_POINT && prevMode === TYPE_NUMBER) {
      currMode = prevMode;
    }
    
    if (prevMode !== null && currMode !== prevMode) {
      chunks.push(chunk);
      chunk = {type: currMode, value: char};
    } else {
      chunk.type = currMode;
      chunk.value += char;
    }
    
    prevMode = currMode;
  }
  
  chunks.push(chunk);
  
  // console.log(chunks);
  
  // scanner & lexer end
  
  const isKeyword = (value) => (KEYWORDS.indexOf(value) >= 0);
  
  const getModeForKeyword = (keyword) => {
    if (SIMPLE_KEYWORDS.includes(keyword)) {
      return 'search_type_or_message';
    } else {
      throw new Error(`Unsupported keyword='${keyword}', don't know what to do next.`);
    }
  };
  
  let parserMode = MODE_COLLECTING_EXPRESSION;
  let expression = '';
  let action = null;
  let type = '';
  let message = '';
  
  for (const chunk of chunks) {
    
    if (parserMode === MODE_COLLECTING_MESSAGE) {
      // append only when some character exists so that leading white spaces are ignored
      if (message || !message && chunk.type !== TYPE_WHITESPACE) {
        message += chunk.value;
      }
    } else if (parserMode === MODE_COLLECTING_TYPE_OR_MESSAGE && chunk.type === TYPE_SPECIAL_CHARACTERS && chunk.value === ':') {
      parserMode = MODE_COLLECTING_MESSAGE;
    } else if (parserMode === MODE_COLLECTING_TYPE_OR_MESSAGE && chunk.type === TYPE_BRACKETS && chunk.value === '{') {
      if (type) {
        throw new Error(`Unexpected '{' - type '${type}' is already found.`);
      }
      parserMode = MODE_COLLECTING_TYPE;
    } else if (parserMode === MODE_COLLECTING_TYPE && chunk.type !== TYPE_BRACKETS && chunk.value !== '}') {
      if (chunk.type !== TYPE_WHITESPACE) {
        type += chunk.value;
      }
    } else if (parserMode === MODE_COLLECTING_TYPE && chunk.type === TYPE_BRACKETS && chunk.value === '}') {
      parserMode = MODE_COLLECTING_TYPE_OR_MESSAGE;
    } else if (parserMode === MODE_COLLECTING_EXPRESSION && chunk.type === TYPE_STRING && isKeyword(chunk.value)) {
      action = chunk.value;
      parserMode = getModeForKeyword(action);
    } else if (parserMode === MODE_COLLECTING_EXPRESSION && chunk.value === '{') {
      parserMode = MODE_COLLECTING_TYPE;
    } else if (parserMode === MODE_COLLECTING_EXPRESSION && chunk.value === ':') {
      parserMode = MODE_COLLECTING_MESSAGE;
    } else if (parserMode === MODE_COLLECTING_EXPRESSION && chunk.type !== TYPE_WHITESPACE) {
      expression += chunk.value;
    }
  }
  
  if (!type) {
    type = null;
  }
  
  if (!message) {
    message = null;
  }
  
  // console.log(`last mode=${parserMode}, expression=${expression}, action=${action}, type=${type}, message=${message}`);
  
  return {
    expression, action, type, message
  }
};

export default parse;

// console.log(parse('variable : message'));
