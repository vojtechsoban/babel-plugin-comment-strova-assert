const KEYWORD_NOT_EMPTY = 'notEmpty';
const KEYWORD_NOT_BLANK = 'notBlank';
const KEYWORDS = [KEYWORD_NOT_EMPTY, KEYWORD_NOT_BLANK];

const input = 'a + 1.5 notEmpty {?string} : Je to prazdny';

const chunks = [];
let chunk = {type: null, value: ''};

const MODE_WHITESPACE = 'whitespace';
const MODE_NUMBER = 'number';
const MODE_STRING = 'string';
const MODE_OPERATORS = 'operator';
const MODE_DECIMAL_POINT = 'decimal_point';
const MODE_BRACKETS = 'brackets';
const MODE_SPECIAL_CHARACTERS = 'special_character';

const WHITESPACES = /[ \t]/;
const NUMBERS = /[0-9]/;
const STRINGS = /[a-zA-Z0-9]/;
const OPERATORS = /[+\-/*]/;
const BRACKETS = /[\[\]{}()]/;
const SPECIAL_CHARACTERS = /[:?]/;

const getMode = (char) => {
  if (WHITESPACES.test(char)) {
    return MODE_WHITESPACE;
  } else if (NUMBERS.test(char)) {
    return MODE_NUMBER;
  } else if (STRINGS.test(char)) {
    return MODE_STRING;
  } else if (char === '.') {
    return MODE_DECIMAL_POINT;
  } else if (OPERATORS.test(char)) {
    return MODE_OPERATORS;
  } else if (BRACKETS.test(char)) {
    return MODE_BRACKETS;
  } else if (SPECIAL_CHARACTERS.test(char)) {
    return MODE_SPECIAL_CHARACTERS;
  } else {
    throw new Error(`Unsupported char '${char}' ordinal=${char.charCodeAt(0)}`);
  }
};

let currMode;
let prevMode = null;

for (const char of input) {
  currMode = getMode(char);
  
  if (currMode === MODE_DECIMAL_POINT && prevMode === MODE_NUMBER) {
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

console.log(chunks);

const isKeyword = (value) => (KEYWORDS.indexOf(value) >= 0);

const getModeForKeyword = (keyword) => {
  if (keyword == KEYWORD_NOT_EMPTY) {
    return 'search_type_or_message';
  } else {
    throw new Error(`Unsupported keyword='${keyword}', don't know what to do next.`);
  }
};

let parserMode = 'collecting_expression';
let expected = [MODE_STRING, MODE_WHITESPACE, MODE_NUMBER, MODE_OPERATORS];
let expression = '';
let keyword = null;
let type = '';
let message = '';

for (const chunk of chunks) {
  
  if (!expected.includes(chunk.type)) {
    throw new Error(`Unexpected type=${chunk.type} (value='${chunk.value}')`);
  }
  
  if (parserMode === 'collecting_message') {
    // append only when some character exists so that leading white spaces are ignored
    if (message || !message && chunk.type !== MODE_WHITESPACE) {
      message += chunk.value;
    }
  } else if (parserMode === 'search_type_or_message' && chunk.type === MODE_SPECIAL_CHARACTERS && chunk.value === ':') {
    parserMode = 'collecting_message';
    expected = [MODE_STRING, MODE_WHITESPACE, MODE_NUMBER, MODE_OPERATORS, MODE_BRACKETS, MODE_SPECIAL_CHARACTERS];
  } else if (parserMode === 'search_type_or_message' && chunk.type === MODE_BRACKETS && chunk.value === '{') {
    if (type) {
      throw new Error(`Unexpected '{' - type '${type}' is already found.`);
    }
    parserMode = 'collecting_type';
    expected = [MODE_STRING, MODE_WHITESPACE, MODE_NUMBER, MODE_OPERATORS, MODE_BRACKETS, MODE_SPECIAL_CHARACTERS];
  } else if (parserMode === 'collecting_type' && chunk.type !== MODE_BRACKETS && chunk.value !== '}') {
    if (chunk.type !== MODE_WHITESPACE) {
      type += chunk.value;
    }
  } else if (parserMode === 'collecting_type' && chunk.type === MODE_BRACKETS && chunk.value === '}') {
    parserMode = 'search_type_or_message';
  } else if (parserMode === 'collecting_expression' && chunk.type === MODE_STRING && isKeyword(chunk.value)) {
    // TODO detect type mode without keyword: // assert name {?string} : Name is usually a string.
    keyword = chunk.value;
    parserMode = getModeForKeyword(keyword);
    expected = [MODE_WHITESPACE, MODE_SPECIAL_CHARACTERS, MODE_BRACKETS];
  } else if (parserMode === 'collecting_expression' && chunk.type !== MODE_WHITESPACE) {
    expression += chunk.value;
  }
}

console.log(`last mode=${parserMode}, expression=${expression}, keyword=${keyword}, type=${type}, message=${message}`);

