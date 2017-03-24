# Strova assert

## Intro

Babel plugin that transforms commented assertions to Javascript code.


## Basic usage

```javascript
const func = (arg1, arg2) => {
  // assert arg1
  // assert arg2 : 2nd argument is null
  return arg1 + arg2;
}
```
by default is transformed to log warning:

```javascript
const func = (arg1, arg2) => {
  if (!function (arg) {
    return sa.assert(arg, 'notNull', [], null, false);
  }(arg1)) console.warn('Assertion error: arg1');
  if (!function (arg) {
    return sa.assert(arg, 'notNull', [], null, false);
  }(arg2)) console.warn('2nd argument is null: arg2');

  return arg1 + arg2;
};
```
but it can be also transformed to throw the Error:

```javascript
const func = (arg1, arg2) => {
  if (!function (arg) {
    return sa.assert(arg, 'notNull', [], null, false);
  }(arg1)) throw new Error('Assertion error: arg1');
  if (!function (arg) {
    return sa.assert(arg, 'notNull', [], null, false);
  }(arg2)) throw new Error('2nd argument is null: arg2');
  
  return arg1 + arg2;
}
```

| Keyword | alias | meaning |
|---------|:-----:|---------|
| *reserved* | ! | nothing - Jsdoc uses ! for not null argument but notNull is default action. So ! is excluded to avoid confusion. |
| nullable | ? | may be null, used for type checking if not null |
| notEmpty | # | *string* must contain white character, *array* must not be zero sized, *object* must have some properites<notBlank |
| notBlank | $ | for *string* only - must not contain white characters only |

## Examples

### Exampe01 

Running [example01.js](example/example01.js) by ``npm run example01``
displays transformed [example/foomodule.js](example/foomodule.js)
in the console output.

### Exampe02 

Running [example02.js](example/example02.js) by ``npm run example02`` runs 
real world code using [example/foomodule.js](example/foomodule.js) in default
plugin configuration: assertion errors are logged in the console.

``npm run example02:throw`` runs again  [example02.js](example/example02.js) but
with ``throw`` profile, assertion errors are thrown and caught instead just only 
logging them.

[![Build Status](https://travis-ci.org/vojtechsoban/babel-plugin-comment-strova-assert.svg?branch=master)](https://travis-ci.org/vojtechsoban/babel-plugin-comment-strova-assert)
