import * as t from './types';

export const notNull = (arg) => (!!arg || arg === 0 || arg === '' || arg === false);

export const notBlank = (arg) => (typeof arg === 'string' && arg.trim().length > 0);

export const notEmpty = (arg) => (!!arg);

export const assert = (arg, action, actionArguments, type, nullable = false) => {

  if (!action) {
   action = t.KEYWORD_NOT_NULL;
  }
  
 const nullableDecorator = (arg, assertFn) => {
   const isNotNull = notNull(arg);
   return (isNotNull || nullable) && (!isNotNull || assertFn(arg));
 };
  
  switch (action) {
    case t.KEYWORD_NOT_NULL:
      return notNull(arg);
      
    case t.KEYWORD_NOT_EMPTY:
      return nullableDecorator(arg, notEmpty);
      
    case t.KEYWORD_NOT_BLANK:
      return nullableDecorator(arg, notBlank);
    default:
      throw new Error(`Unsupported action='${action}'`);
  }
};
