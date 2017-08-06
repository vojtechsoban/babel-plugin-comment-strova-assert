/** @module dummy module */

/**
 * This is the simpliest assertion that both arguments must be present.
 * Contrast to if (number) { ... } arguments may be 0, '', false, ...
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
 * This one demonstrates that the first and the third argument must not be empty strings
 * and the middle argument may not be present but when present it must not be empty
 * @param {!string} givenName
 * @param {?string} middleName
 * @param {?string} surname
 * @returns {string}
 */
export const buildFullName = (givenName, middleName, surname) => {
  // assert givenName {$string} : Given name is missing
  // assert middleName {?string} : Middle name is missing
  // assert surname {$string} : Surname name is missing
  return givenName + (middleName ? middleName : '') + (surname ? surname : '');
};

export const greeting = (name, surname) => {
  // assert name notEmpty {string} : Name should not be empty, at least a space character.
  // assert name notBlank {string} : Surname should not be blank, give me some non-white character
  return `Hello ${name} ${surname}`;
};

// assert arg1 {?number >= 5}
// assert arg2 range(2,5> {2 <= number <= 5}
