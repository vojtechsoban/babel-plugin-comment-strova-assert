import {add, greeting} from './calc';

const expected = process.env.BABEL_ENV === 'throw';

const wrapper = (func, expected = true) => {
  let result = null;
  let caught = false;
  try {
    result = func();
  } catch (e) {
    caught = true;
    if (expected) {
      console.log('Expected error: ' + e);
    } else {
      console.error('Unpected error: ' + e);
    }
  } finally {
    console.log(`expected=${expected}, caught=${caught}, result: ${result}`);
  }
};

wrapper(() => (`result of add(1, 2): ${add(1, 2)}`), false);
wrapper(() => (`result of add(1): ${add(1)}`), expected);
wrapper(() => (`result of add(): ${add()}`), expected);
wrapper(() => (`result of greeting('a', 'b'): ${greeting('a', 'b')}`), false);
wrapper(() => (`result of greeting('a'): ${greeting('a')}`), expected);
wrapper(() => (`result of greeting(): ${greeting()}`), expected);
