import * as t from './types';
import lexer from './lexer';
import {markString} from './utils';

// Parser modes
const MODE_COLLECTING_EXPRESSION = 'collecting_expression';
const MODE_COLLECTING_MESSAGE = 'collecting_message';
const MODE_COLLECTING_TYPE = 'collecting_type';
const MODE_COLLECTING_TYPE_OR_MESSAGE = 'search_type_or_message';

// Parser sub modes
// TODO remove hardcoded values

const isKeyword = (value) => (t.KEYWORDS.indexOf(value) >= 0);

const isModifier = (value) => (['?', '#', '$'].includes(value));

const getModeForKeyword = (keyword) => {
  if (t.KEYWORDS.includes(keyword)) {
    return MODE_COLLECTING_TYPE_OR_MESSAGE;
  } else {
    throw new Error(`Unsupported keyword='${keyword}', don't know what to do next.`);
  }
};

const isBeginningOfNumber = (token) => (token.type === t.TYPE_NUMBER || token.value === '-' || token.value === '+');

export const parse = (input) => {
  
  let parserMode = MODE_COLLECTING_EXPRESSION;
  let parserSubMode = 'beginning';
  let expression = '';
  let action = null;
  let type = null;
  let message = '';
  let actionArguments = [];
  let nullable = false;
  
  const tokens = lexer(input);
  for (let i = 0; i < tokens.length; i++) {
    const chunk = tokens[i];
    
    if (parserMode === MODE_COLLECTING_MESSAGE) {
      // append only when some character exists so that leading white spaces are ignored
      if (message || !message && chunk.type !== t.TYPE_WHITESPACE) {
        message += chunk.value;
      }
    } else if (parserMode === MODE_COLLECTING_TYPE_OR_MESSAGE && chunk.type === t.TYPE_SYMBOLS && chunk.value === ':') {
      parserMode = MODE_COLLECTING_MESSAGE;
    } else if (parserMode === MODE_COLLECTING_TYPE_OR_MESSAGE && chunk.type === t.TYPE_SYMBOLS && chunk.value === '{') {
      if (type) {
        throw new Error(`Unexpected '{' - type '${type}' is already found.`);
      }
      parserMode = MODE_COLLECTING_TYPE;
    } else if (parserMode === MODE_COLLECTING_TYPE && !(chunk.type === t.TYPE_SYMBOLS && chunk.value === '}')) {
      
      if (chunk.type === t.TYPE_WHITESPACE) {
        continue;
      }
      
      if ((parserSubMode === 'beginning' || parserSubMode === 'expecting_last_argument') && isBeginningOfNumber(chunk)) {
        let sign = 1;
        if (chunk.type === t.TYPE_SYMBOLS && ['+', '-'].includes(chunk.value)) {
          sign = chunk.value === '-' ? -1 : 1;
          i++;
          while (tokens[i].type === t.TYPE_WHITESPACE) {
            i++;
          }
        }
        
        if (tokens[i].type === t.TYPE_NUMBER) {
          actionArguments.push(sign * parseFloat(tokens[i].value));
          i++;
        } else {
          throw new Error(`Unexpected type: ${tokens[i].type}, value: ${tokens[i].value}, input: '${markString(input, chunk.position)}'`);
        }
        if (parserSubMode === 'beginning') {
          parserSubMode = 'expecting_operator';
        } else {
          parserSubMode = 'done';
        }
      } else if (parserSubMode === 'beginning' && chunk.type === t.TYPE_STRING && t.TYPES.includes(chunk.value)) {
        type = chunk.value;
        parserSubMode = 'expecting_post_operator';
      } else if (parserSubMode === 'beginning' && chunk.type === t.TYPE_SYMBOLS && isModifier(chunk.value)) {
        switch (chunk.value) {
          case '?':
            nullable = true;
            break;
          case '$':
            // Just to avoid breaking examples
            console.warn(`// TODO Unprocessed chunk "$"`);
            break;
            // TODO other types #, $
          default:
            throw new Error(`Unexpected modifier "${chunk.value}" at position ${chunk.position}, type=${chunk.type}`);
        }
      } else if ((parserSubMode === 'expecting_operator' || parserSubMode === 'expecting_post_operator') && chunk.value === '<') {
        if (tokens[i + 1].value === '=') {
          actionArguments.push(chunk.value + '=');
          i++;
        } else {
          actionArguments.push(chunk.value);
        }
        if (parserSubMode === 'expecting_post_operator') {
          parserSubMode = 'expecting_last_argument';
        } else {
          parserSubMode = 'beginning';
        }
      } else {
        throw new Error(`Unexpected token type=${chunk.type}, value='${chunk.value}', position=${chunk.position},`
          + ` input: '${markString(input, chunk.position)}'`);
      }
    } else if (parserMode === MODE_COLLECTING_TYPE && chunk.type === t.TYPE_SYMBOLS && chunk.value === '}') {
      parserMode = MODE_COLLECTING_TYPE_OR_MESSAGE;
    } else if (parserMode === MODE_COLLECTING_EXPRESSION && chunk.type === t.TYPE_STRING && isKeyword(chunk.value)) {
      // exception - nullable is only modifier, that does not change the parser mode
      if (chunk.value === t.KEYWORD_NULLABLE) {
        nullable = true;
      } else {
        action = chunk.value;
        parserMode = getModeForKeyword(action);
      }
    } else if (parserMode === MODE_COLLECTING_EXPRESSION && chunk.value === '{') {
      parserMode = MODE_COLLECTING_TYPE;
    } else if (parserMode === MODE_COLLECTING_EXPRESSION && chunk.value === ':') {
      parserMode = MODE_COLLECTING_MESSAGE;
    } else if (parserMode === MODE_COLLECTING_EXPRESSION && chunk.type !== t.TYPE_WHITESPACE) {
      expression += chunk.value;
    }
  }
  
  if (!message) {
    message = null;
  }
  
  // range is only supported action with arguments so if actionArguments is not empty then range is the action
  if (actionArguments.length) {
    actionArguments.forEach((arg) => {
      if (typeof arg !== 'number' && !(typeof arg === 'string' && ['<', '<='].includes(arg))) {
        throw new Error(`Action arguments contain unsupported value='${arg}'`);
      }
    });
    action = 'range';
  }
  
  return {
    expression, action, actionArguments, nullable, type, message
  }
};

export default parse;
