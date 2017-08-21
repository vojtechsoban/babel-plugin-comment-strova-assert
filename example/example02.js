import {add, greeting, buildFullName} from './foomodule';

const strovaAssert = require('strova-assert').default;

const expected = process.env.BABEL_ENV === 'throw';
if (expected) {
  strovaAssert.setAction(strovaAssert.actions.throwError);
} else {
  strovaAssert.setAction(strovaAssert.actions.logError);
}

const valid = false;

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
    console.log(`expected=${expected}, caught=${caught}, result: ${result} - ${expected === caught ? 'OK' : 'NOK'}`);
    console.log('--------------')
  }
};

wrapper(() => (`result of add(1, 2): ${add(1, 2)}`), valid);
wrapper(() => (`result of add(1): ${add(1)}`), expected);
wrapper(() => (`result of add(): ${add()}`), expected);
wrapper(() => (`result of greeting('a', 'b'): ${greeting('a', 'b')}`), valid);
wrapper(() => (`result of greeting('a'): ${greeting('a')}`), expected);
wrapper(() => (`result of greeting(' ', ' '): ${greeting(' ', ' ')}`), expected);
wrapper(() => (`result of greeting('a', ''): ${greeting('a', ' ')}`), expected);
wrapper(() => (`result of greeting(): ${greeting()}`), expected);


wrapper(() => (`result of buildFullName(): ${buildFullName()}`), expected);

