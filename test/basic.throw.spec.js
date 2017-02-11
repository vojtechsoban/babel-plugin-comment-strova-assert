import chai, {assert, expect, should} from 'chai';
import sinon from 'sinon';
import {add} from '../example/calc';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

describe('Tesing calc method "add"', function () {

  it('should calculate 1 + 2', () => {
    expect(add(1, 2)).to.be.equal(3);
  });

  it('should throw error when both arguments missing', () => {
    expect(() => {
      add()
    }).to.throw('Assertion error: arg1');
  });

  it('should throw error when the second argument is missing', () => {
    expect(() => {
      add(1)
    }).to.throw('Assertion error: arg2');
  });
});
