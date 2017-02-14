/** @module dummy module */

/**
 *
 * @param {!number} arg1
 * @param {!number} arg2
 * @returns {number}
 */
export const add = (arg1, arg2) => {
  // assert arg1
  // assert arg2
  return arg1 + arg2;
};

/**
 *
 * @param {!number} arg1
 * @param {!number} arg2
 * @returns {number}
 */
export const sum = (arg1, arg2) => {
  // assert arg1 {number} : Both arguments missing
  // assert arg2 {number} : The second argument is missing
  return arg1 + arg2;
};

/**
 *
 * @param {!string} arg1
 * @param {?string} arg2
 * @param {?string} arg3
 * @returns {string}
 */
export const concatenate = (arg1, arg2, arg3) => {
  // assert arg1 {string} : The first string is missing
  // assert arg2 {?string} : The second argument is not a string
  // assert arg3 nullable {string} : The third argument is not a string
  return arg1 + (arg2 ? arg2 : '') + (arg3 ? arg3 : '');
};

export const greeting = (name, surname) => {
  // assert name notEmpty {string} : Name should not be empty, at least a space character.
  // assert name notBlank {string} : Surname should not be blank, give me some non-white character
  return `Hello ${name} ${surname}`;
};

// assert arg1 {?number >= 5}
// assert arg2 range(2,5> {2 <= number <= 5}
