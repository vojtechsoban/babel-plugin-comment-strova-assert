export const foo = (arg1, arg2) => {
  if (!arg1) throw new Error('Missing arguments');
  if (!arg2) throw new Error('2nd argument is missing');
  return arg1 + arg2;
};
