import chai, {assert, expect, should} from 'chai';
import sinon from 'sinon';
import {add, greeting} from '../example/foomodule';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

describe('Tesing calc method "add"', function () {

  it('should calculate 1 + 2', () => {
    expect(add(1, 2)).to.be.equal(3);
  });

  it('should throw error when both arguments missing', () => {
    expect(() => {
      add()
    }).to.throw('Expression is null: arg1');
  });

  it('should throw error when the second argument is missing', () => {
    expect(() => {
      add(1)
    }).to.throw('Expression is null: arg2');
  });

  it('greeting()', () => {
    expect(() => {
      greeting()
    }).to.throw('Name should not be empty, at least a space character.');
  });

  it('greeting(\'a\')', () => {
    expect(() => {
      greeting('a')
    }).to.throw('Surname should not be blank, give me some non-white character.');
  });
});
